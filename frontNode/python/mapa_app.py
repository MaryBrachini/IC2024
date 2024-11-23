import streamlit as st
from streamlit_folium import folium_static
import folium
import psycopg2

# Aplicar estilo CSS para remover o espaço ao redor do mapa e ajustar a largura do seletor
st.markdown(
     """
     <style>
    .main .block-container {
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: left;
        width: 100%;
    }
    .stSelectbox {
        width: 150px;
        font-size: 14px;
        margin-bottom: 20px;
    }
    iframe {
        height: 50vh;
        width: 63vw;
        border: none;
        overflow: hidden;
    }
    </style>
    """,
    unsafe_allow_html=True
)

# Função para conectar ao banco de dados e buscar todas as localizações
def get_ocorrencia_locations():
    try:
        # Conexão ao banco de dados
        conn = psycopg2.connect(
            dbname="vdadosdev",
            user="vdadmin",
            password="p0stdb@!",
            host="localhost"
        )
        
        # Criar um cursor para executar a consulta
        cursor = conn.cursor()
        
        # Executar a consulta para obter todas as localizações
        query = """
            SELECT latitude, longitude 
            FROM vdaocorrencia;
        """
        cursor.execute(query)
        
        # Obter os resultados e fechar a conexão
        locations = cursor.fetchall()
        cursor.close()
        conn.close()
        
        # Garantir que as coordenadas são floats
        locations = [(float(lat), float(lon)) for lat, lon in locations]
        
        return locations
    
    except psycopg2.DatabaseError as e:
        st.error(f"Erro ao conectar ao banco de dados: {e}")
        return []

# Obter as localizações das ocorrências
locations = get_ocorrencia_locations()

if not locations:
    st.warning("Nenhuma ocorrência encontrada.")
else:
    # Calcular a média das coordenadas para centralizar o mapa
    avg_lat = sum(lat for lat, lon in locations) / len(locations)
    avg_lon = sum(lon for lat, lon in locations) / len(locations)
    
    # Criar o mapa centrado na média das localizações
    mymap = folium.Map(location=[avg_lat, avg_lon], zoom_start=15)

    # Adicionar marcadores para cada localização na lista
    for location in locations:
        folium.CircleMarker(
            location=location,
            radius=10,
            color='blue',
            fill=True,
            fill_color='blue'
        ).add_to(mymap)

    # Exibir o mapa usando o streamlit-folium
    folium_static(mymap)
