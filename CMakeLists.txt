cmake_minimum_required(VERSION 2.8.11)

project(qml-invaders)

find_package(Qt5Widgets)
find_package(Qt5Qml)
find_package(Qt5Core)

set(SOURCES game/main.cpp
	    game/resources.qrc
	)

set(CMAKE_AUTOMOC on)
set(CMAKE_AUTORCC on)

add_executable(${PROJECT_NAME} ${SOURCES})

target_link_libraries(${PROJECT_NAME} Qt5::Core)
target_link_libraries(${PROJECT_NAME} Qt5::Widgets)
target_link_libraries(${PROJECT_NAME} Qt5::Qml)

add_custom_command(
	TARGET ${PROJECT_NAME} POST_BUILD
        COMMAND ${CMAKE_COMMAND} -E copy_directory
                ${CMAKE_SOURCE_DIR}/game/content
                ${CMAKE_CURRENT_BINARY_DIR}/content)
