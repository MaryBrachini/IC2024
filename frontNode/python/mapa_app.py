import streamlit as st
from streamlit_folium import folium_static
import folium
import psycopg2
from datetime import datetime, timedelta

# Aplicar estilo CSS para remover o espaço ao redor do mapa e ajustar a largura do seletor
st.markdown(
     """
     <style>
    .main .block-container {
        padding: 0;  /* Remove todo o padding */
        display: flex;
        flex-direction: column;
        align-items: center;  /* Centraliza horizontalmente */
        width: 100%; /* Garante que o contêiner ocupe 100% da largura */
    }
    .stSelectbox {
        width: 150px;  /* Ajustar largura do seletor */
        font-size: 14px; /* Ajustar tamanho da fonte */
        margin-bottom: 20px; /* Espaço abaixo do seletor */
    }
    iframe {
        height: 75vh;  /* Define a altura do mapa para 75% da altura da janela */
        width: 100vw;  /* O mapa vai ocupar 100% da largura da janela */
        border: none; /* Remove a borda do iframe */
        overflow: hidden; /* Remove a barra de rolagem */
    }
    </style>
    """,
    unsafe_allow_html=True
)

# Função para retornar o intervalo de tempo baseado na escolha do usuário
def get_time_filter(option):
    today = datetime.today()
    if option == "Últimos 15 dias":
        return today - timedelta(days=15)
    elif option == "Últimos 30 dias":
        return today - timedelta(days=30)
    elif option == "Últimos 6 meses":
        return today - timedelta(days=180)
    elif option == "Último ano":
        return today - timedelta(days=365)
    return None

# Conectar ao banco de dados
def get_data_from_db(time_filter):
    conn = psycopg2.connect(
        dbname="vdadosdev",
        user="vdadmin",
        password="p0stdb@!",
        host="localhost"
    )
    cur = conn.cursor()
    
    query = """
        SELECT latitude, longitude
        FROM vdaocorrencia
        WHERE dataocorrencia >= %s 
    """
    cur.execute(query, (time_filter,))
    data = cur.fetchall()
    
    cur.close()
    conn.close()
    
    return data

# Opções de filtro de tempo
time_options = ["Últimos 15 dias", "Últimos 30 dias", "Últimos 6 meses", "Último ano"]
selected_option = st.selectbox("Selecione o período de tempo:", time_options)

# Obter o filtro de tempo
time_filter = get_time_filter(selected_option)

# Obter os dados filtrados do banco de dados
data = get_data_from_db(time_filter)

# Criar o mapa centrado em uma localização padrão
mymap = folium.Map(location=[-20.41535, -49.98621], zoom_start=12)

# Adicionar marcadores ao mapa com base nos dados do banco de dados
for location in data:
    folium.CircleMarker(
        location=location,
        radius=10,
        color='blue',
        fill=True,
        fill_color='blue'
    ).add_to(mymap)

# Exibir o mapa no Streamlit
folium_static(mymap)
