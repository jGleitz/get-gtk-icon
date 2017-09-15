#include <uv.h>
#include <node.h>
#include <gtk/gtk.h>
#include <string.h>

namespace getgtkicon {
	using namespace v8;
	using namespace std;

	struct IconRequest {
		uv_work_t uvRequest;
		Persistent<Function> callback;

		string* iconName;
		uint32_t iconSize;
		string* iconPath;
	};

	const char* getIcon(const string* iconName, uint32_t iconSize) {
		gtk_init(0, NULL);
		GtkIconTheme* defaultIconTheme = gtk_icon_theme_get_default();
		GtkIconInfo* iconInfo =
			gtk_icon_theme_lookup_icon(defaultIconTheme, iconName->c_str(), iconSize, (GtkIconLookupFlags) 0);
		if (iconInfo == NULL) {
			return NULL;
		}

		return gtk_icon_info_get_filename(iconInfo);
	}

	static Local<Value> toJs(const char* iconPath, Isolate* isolate) {
		if (iconPath == NULL) {
			return Null(isolate);
		}
		return String::NewFromUtf8(isolate, iconPath);
	}

	static Local<Value> toJs(string* iconPath, Isolate* isolate) {
		if (iconPath == NULL) {
			return Null(isolate);
		}
		return toJs(iconPath->c_str(), isolate);
	}

	static void startGetIcon(uv_work_t *work) {
		IconRequest* request = static_cast<IconRequest*>(work->data);
		const char* iconPath = getIcon(request->iconName, request->iconSize);
		if (iconPath != NULL) {
			request->iconPath = new string(iconPath);
		}
	}

	static void afterGetIcon(uv_work_t *work, int status) {
		Isolate* isolate = Isolate::GetCurrent();
		HandleScope handleScope(isolate);

		IconRequest* request = static_cast<IconRequest*>(work->data);

		Local<Value> argv[] = {toJs(request->iconPath, isolate)};
		Local<Function> localCallback = Local<Function>::New(isolate, request->callback);
		localCallback->Call(isolate->GetCurrentContext()->Global(), 1, argv);

		request->callback.Reset();
		delete request->iconName;
		delete request->iconPath;
		delete request;
	}

	void startAsyncGetIcon(const FunctionCallbackInfo<Value>& args) {
		Isolate* isolate = args.GetIsolate();

		IconRequest* request = new IconRequest();
		request->uvRequest.data = request;

		request->iconName = new string(*v8::String::Utf8Value(args[0]));
		request->iconSize = args[1]->Uint32Value();
		request->callback.Reset(isolate, args[2].As<Function>());

		uv_queue_work(uv_default_loop(), &request->uvRequest, startGetIcon, afterGetIcon);

		args.GetReturnValue().Set(Undefined(isolate));
	}

	void syncGetIcon(const FunctionCallbackInfo<Value>& args) {
		Isolate* isolate = args.GetIsolate();

		string iconName = string(*v8::String::Utf8Value(args[0]));
		uint32_t iconSize = args[1]->Uint32Value();
		const char* iconPath = getIcon(&iconName, iconSize);
		Local<Value> jsIconPath = toJs(iconPath, isolate);
		args.GetReturnValue().Set(jsIconPath);
	}

	void init(Local<Object> exports) {
		NODE_SET_METHOD(exports, "getIcon", startAsyncGetIcon);
		NODE_SET_METHOD(exports, "getIconSync", syncGetIcon);
	}

	NODE_MODULE(NODE_GYP_MODULE_NAME, init)
}
