# qml-invaders
Space invaders Qt/QML

A simple space invaders clone written in QML in order to learn QML for work.

# 1. building & running (shadow build/out of source build):
git clone https://github.com/ingmarolsson/qml-invaders.git
mkdir qml-invaders-build  
cd qml-invaders-build  

# 1.1 Build with QMake
qmake ../qml-invaders  
make  
cd game  
./qml-invaders  

# 1.2 Build with CMake
cmake ../qml-invaders  
make  
./qml-invaders  
