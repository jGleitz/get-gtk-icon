{
  "targets": [{
    "target_name": "gtkicon",
    "conditions": [
      ["<!(pkg-config gtk+-3.0 > /dev/null 2>&1; echo $?) == 0", {
        "sources": ["src/c++/gtkicon.cc"],
        "include_dirs": ["<!@(pkg-config --cflags-only-I gtk+-3.0 | sed s/-I//g)"],
        "libraries": ["<!@(pkg-config --libs gtk+-3.0)"]
      }]
    ]
  }]
}
