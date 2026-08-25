"""KIRA+ Streamlit entry point.

Pages live in pages/. This file only sets shared page config and the
persistent synthetic-data notice; it must never contain scoring logic.
"""
import streamlit as st

st.set_page_config(page_title="KIRA+", page_icon=":abacus:", layout="wide")

st.sidebar.caption("Demo mode -- synthetic profiles only. Not financial advice.")

st.title("KIRA+")
st.caption("Kira Dulu. Baru Commit.")
