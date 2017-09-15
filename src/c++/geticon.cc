#include <node.h>
#include <assert.h>
#include <gtk/gtk.h>
#include <gdk/gdk.h>

#define DECLARE_NAPI_METHOD(name, func) \
	{name, NULL, func, NULL, NULL, NULL, napi_default, NULL}

namespace getgtkicon {
	using namespace v8;

	void getIcon(const FunctionCallbackInfo<Value>& args) {
		Isolate* isolate = args.GetIsolate();
		HandleScope scope(isolate);

		if (args.Length() < 1) {
			isolate->ThrowException(Exception::Error(
				String::NewFromUtf8(isolate, "No icon name provided!")));
			return;
		}
		if (args.Length() < 2) {
			isolate->ThrowException(Exception::Error(
				String::NewFromUtf8(isolate, "No icon size provided!")));
			return;
		}
		if (!args[0]->IsString()) {
			isolate->ThrowException(Exception::TypeError(
				String::NewFromUtf8(isolate, "Icon name must be a string!")));
			return;
		}
		if (!args[1]->IsNumber()) {
			isolate->ThrowException(Exception::TypeError(
				String::NewFromUtf8(isolate, "Icon size must be a number!")));
			return;
		}

		String::Utf8Value iconName(args[0]->ToString());
		uint32_t iconSize = args[1]->Uint32Value();

		gtk_init(0, NULL);
		GtkIconTheme* defaultIconTheme = gtk_icon_theme_get_for_screen(gdk_screen_get_default());
		GtkIconInfo* iconInfo =
		 	gtk_icon_theme_lookup_icon(defaultIconTheme, *iconName, iconSize, (GtkIconLookupFlags) 0);
		if (iconInfo == NULL) {
			return;
		}

		const char* iconPath = gtk_icon_info_get_filename(iconInfo);
		args.GetReturnValue().Set(String::NewFromUtf8(isolate, iconPath));
	}

	void init(Local<Object> exports) {
		NODE_SET_METHOD(exports, "getIcon", getIcon);
	}

	NODE_MODULE(NODE_GYP_MODULE_NAME, init)
}
