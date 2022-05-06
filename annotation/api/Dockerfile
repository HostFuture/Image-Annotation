FROM python:latest

RUN mkdir /api
WORKDIR /api

COPY . ./
RUN pip3 install -r ./requirements.txt
ENV FLASK_ENV production

EXPOSE 5000
CMD ["gunicorn", "-w 4", "-b", "0.0.0.0:5000", "run:app"]