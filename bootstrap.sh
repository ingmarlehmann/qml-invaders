#!/bin/bash

# in case qmake && make was run before the boostrap script (with errors), delete the folder so we can check out the submodule
rm -rf external/commonjs/plugin/

git submodule update --init
