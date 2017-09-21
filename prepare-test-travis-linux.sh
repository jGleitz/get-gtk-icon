#!/bin/sh

export DISPLAY=:99.0
export HAS_GTK3=TRUE
sh -e /etc/init.d/xvfb start
mkdir -p ~/.config/gtk-3.0
echo -e "[Settings]\ngtk-icon-theme-name=Tango" >> ~/.config/gtk-3.0/settings.ini
