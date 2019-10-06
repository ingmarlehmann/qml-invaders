# qml-invaders
Space invaders Qt/QML

A simple space invaders clone written in QML in order to learn QML for work.

<p>
<img src="https://raw.githubusercontent.com/ingmarlehmann/qml-invaders/master/docs/screenshots/menu.png" width="320" height="320"/>
<img src="https://raw.githubusercontent.com/ingmarlehmann/qml-invaders/master/docs/screenshots/game.png" width="320" height="320"/>
</p>

# 1. Building & running:
```bash
git clone https://github.com/ingmarlehmann/qml-invaders.git
mkdir qml-invaders-build  
cd qml-invaders-build  
```

# 1.1 Build with QMake
```bash
qmake ../qml-invaders  
make  
cd game  
./qml-invaders  
```

# 1.2 Build with CMake
```bash
cmake ../qml-invaders  
make  
./qml-invaders  
```
