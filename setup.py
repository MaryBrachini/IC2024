import streamlit as st
from streamlit_folium import folium_static
import folium

# Lista de coordenadas das localizações
locations = [
    [-20.41535, -49.98621],
    [-20.415, -49.986],
    [-20.416, -49.987]
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

