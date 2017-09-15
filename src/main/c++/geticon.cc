#include <node_api.h>
#include <assert.h>
#include <gtk/gtk.h>

#define DECLARE_NAPI_METHOD(name, func) \
	{name, NULL, func, NULL, NULL, NULL, napi_default, NULL}

namespace getgtkicon {
	napi_value getIcon(napi_env env, napi_callback_info info) {
		napi_status status;
		napi_value args[2];

		size_t argc = 2;
		status = napi_get_cb_info(env, info, &argc, args, NULL, NULL);
		assert(status == napi_ok);

		if (argc < 1) {
			napi_throw_error(env, NULL, "No application name provided!");
			return NULL;
 		}
		if (argc < 2) {
			napi_throw_error(env, NULL, "No icon size provided!");
			return NULL;
		}

		napi_value iconNameValue = args[0];
		napi_value iconSizeValue = args[1];

		// convert icon name
		napi_valuetype iconNameType;
		status = napi_typeof(env, iconNameValue, &iconNameType);
		assert(status == napi_ok);
		if (iconNameType != napi_string) {
			napi_throw_type_error(env, NULL, "The application name is not a string!");
			return NULL;
		}
		size_t iconNameLength;
		status = napi_get_value_string_utf8(env, iconNameValue, NULL, 0, &iconNameLength);
		assert(status == napi_ok);
		size_t readIconNameLength;
		char iconName[iconNameLength];
		status = napi_get_value_string_utf8(env, iconNameValue, iconName, iconNameLength, &readIconNameLength);
		assert(status == napi_ok);
		assert(readIconNameLength == iconNameLength);

		// convert icon size
		napi_valuetype iconSizeType;
		status = napi_typeof(env, iconSizeValue, &iconSizeType);
		assert(status == napi_ok);
		if (iconSizeType != napi_number) {
			napi_throw_type_error(env, NULL, "The icon size is not a number!");
			return NULL;
		}
		int32_t iconSize;
		status = napi_get_value_int32(env, iconSizeValue, &iconSize);
		assert(status == napi_ok);

		GtkIconTheme* defaultIconTheme = gtk_icon_theme_get_default();
		GtkIconInfo* iconInfo =
		 	gtk_icon_theme_lookup_icon(defaultIconTheme, iconName, iconSize, (GtkIconLookupFlags) 0);
		if (iconInfo == NULL) {
			return NULL;
		}

		const char* iconPath = gtk_icon_info_get_filename(iconInfo);
		napi_value jsIconPath;
		status = napi_create_string_utf8(env, iconPath, -1, &jsIconPath);
		assert(status == napi_ok);

		return jsIconPath;
	}

	void init(napi_env env, napi_value exports, napi_value module, void* priv) {
		napi_status status;
		napi_property_descriptor desc = DECLARE_NAPI_METHOD("getIcon", getIcon);
		status = napi_define_properties(env, exports, 1, &desc);
		assert(status == napi_ok);
	}

	NAPI_MODULE(NODE_GYP_MODULE_NAME, init)
}
