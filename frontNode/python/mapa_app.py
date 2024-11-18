import streamlit as st
from streamlit_folium import folium_static
import folium
import psycopg2
from datetime import datetime

# Aplicar estilo CSS para remover o espaço ao redor do mapa e ajustar a largura do seletor
st.markdown(
     """
     <style>
    .main .block-container {
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }
    .stSelectbox {
        width: 150px;
        font-size: 14px;
        margin-bottom: 20px;
    }
    iframe {
        height: 75vh;
        width: 100vw;
        border: none;
        overflow: hidden;
    }
    </style>
    """,
    unsafe_allow_html=True
)

# Função para conectar ao banco de dados e buscar as localizações com filtro de data
def get_ocorrencia_locations(data_inicio, data_fim):
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
        
        # Executar a consulta para obter as localizações dentro do período especificado
        query = """
            SELECT latitude, longitude 
            FROM vdaocorrencia
            WHERE dataocorrencia BETWEEN %s AND %s;
        """
        cursor.execute(query, (data_inicio, data_fim))
        
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

# Selecionar a data inicial e final
data_inicio = st.date_input("Data Inicial", datetime(2023, 1, 1))
data_fim = st.date_input("Data Final", datetime.today())

# Verificar se as datas estão em ordem válida
if data_inicio > data_fim:
    st.error("A data inicial não pode ser posterior à data final.")
else:
    # Converter as datas para o formato que o banco de dados espera (YYYY-MM-DD)
    data_inicio_str = data_inicio.strftime('%Y-%m-%d')
    data_fim_str = data_fim.strftime('%Y-%m-%d')
    
    # Obter as localizações das ocorrências no período selecionado
    locations = get_ocorrencia_locations(data_inicio_str, data_fim_str)

    if not locations:
        st.warning("Nenhuma ocorrência encontrada para o período selecionado.")
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
