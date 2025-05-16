import streamlit as st
import pandas as pd
import json
import plotly.express as px
from sklearn.cluster import KMeans
from sklearn.tree import DecisionTreeClassifier

st.set_page_config(page_title="تحليل لعبة 2048", layout="wide")
st.title("🎮 تحليل سلوك اللاعبين في لعبة 2048")

uploaded_file = st.file_uploader("📁 ارفع ملف الجلسات (game_sessions_data.json)", type="json")

if uploaded_file:
    data = json.load(uploaded_file)
    df = pd.DataFrame(data)

    st.subheader("📊 ملخص البيانات")
    st.metric("عدد الجلسات", len(df))
    st.metric("عدد الفوز", (df["result"] == "win").sum())
    st.metric("عدد الخسارة", (df["result"] == "lose").sum())
    st.metric("متوسط عدد الحركات", round(df["movesCount"].mean(), 2))
    st.metric("متوسط المدة (ثانية)", round(df["durationSeconds"].mean(), 2))

    st.subheader("📈 رسم تفاعلي")
    fig = px.scatter(df, x="movesCount", y="durationSeconds", color="result",
                     title="عدد الحركات مقابل المدة")
    st.plotly_chart(fig)

    st.subheader("🤖 توقع النتيجة باستخدام Decision Tree")
    df["label"] = df["result"].map({"win": 1, "lose": 0})
    model = DecisionTreeClassifier()
    model.fit(df[["movesCount", "durationSeconds"]], df["label"])

    move_input = st.slider("عدد الحركات", 10, 200, 100)
    time_input = st.slider("مدة اللعب (ثواني)", 1, 800, 60)

    prediction = model.predict([[move_input, time_input]])
    st.success("✅ التوقع: فوز" if prediction[0] == 1 else "❌ التوقع: خسارة")

    st.subheader("🧠 Clustering (KMeans)")
    kmeans = KMeans(n_clusters=3)
    df["cluster"] = kmeans.fit_predict(df[["movesCount", "durationSeconds"]])
    fig2 = px.scatter(df, x="movesCount", y="durationSeconds", color=df["cluster"].astype(str),
                      title="توزيع اللاعبين حسب التجميع (Clusters)")
    st.plotly_chart(fig2)