import streamlit as st
from streamlit_folium import folium_static
import folium

# Lista de coordenadas das localizações
locations = [
    [-20.41535, -49.98621],
    [-20.41958, -49.98586],
    [-20.43072, -49.97739],
    [-20.42079, -49.96233],
    [-20.42777, -49.95989],
    [-20.3913, -49.9772],
    [-20.43947, -49.99455],
    [-20.41863, -49.96548],
    [-20.40675, -49.96171],
    [-20.41801, -49.97098],
    [-20.39141, -49.96792],
    [-20.38903, -49.96967],
    [-20.43402, -49.97984],
    [-20.43678, -49.98015],
    [-20.41262, -49.98295],
    [-20.41229, -49.98559],
    [-20.43308, -49.96921],
    [-20.42559, -49.97096],
    [-20.3936, -49.97761]
]

# Criar um mapa centrado em uma localização específica
mymap = folium.Map(location=[-20.41535, -49.98621], zoom_start=15)

# Adicionar marcadores para cada localização na lista
for location in locations:
    folium.CircleMarker(
        location=location,
        radius=10,  # Tamanho do raio da bolha
        color='blue',  # Cor da borda da bolha
        fill=True,
        fill_color='blue'  # Cor de preenchimento da bolha
    ).add_to(mymap)

# Exibir o mapa usando o streamlit-folium
folium_static(mymap)
