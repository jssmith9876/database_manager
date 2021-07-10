FROM python:3.8
LABEL maintainer="jssmith9876@yahoo.com"
COPY . /api
WORKDIR /api
RUN pip install -r requirements.txt
CMD ["python", "api.py"]