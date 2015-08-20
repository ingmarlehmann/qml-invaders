# qml-invaders
Space invaders Qt/QML

A simple space invaders clone written in QML in order to learn QML for work.

This game depends on the CommonJS plugin (https://github.com/grassator/qml-commonjs).

# building & running (shadow build/out of source build):
git clone --recursive https://github.com/ingmarolsson/qml-invaders.git # !! Note the --recursive parameter to checkout submodules.  
mkdir qml-invaders-build  
cd qml-invaders-build  
qmake ../qml-invaders/  
make  
cd game  
./qml-invaders  


