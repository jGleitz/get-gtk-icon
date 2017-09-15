{
  "targets": [
    {
      "target_name": "geticon",
      "sources": ["src/main/c++/geticon.cc"],
      "libraries": ["<!@(pkg-config --libs gtk+-3.0)"],
      "include_dirs": ["<!@(pkg-config --cflags-only-I gtk+-3.0 | sed s/-I//g)"]
    }
  ]
}
