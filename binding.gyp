{
  "targets": [
    {
      "target_name": "geticon",
      "sources": ["src/c++/geticon.cc"],
      "include_dirs": ["<!@(pkg-config --cflags-only-I gtk+-3.0 | sed s/-I//g)"],
      "libraries": ["<!@(pkg-config --libs gtk+-3.0)"]
    }
  ]
}