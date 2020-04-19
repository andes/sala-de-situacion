FROM ubuntu:16.04
RUN apt-get update
RUN apt-get install -y openssl libssl-dev 	libgssapi-krb5-2 wget

RUN wget https://info-mongodb-com.s3.amazonaws.com/mongodb-bi/v2/mongodb-bi-linux-x86_64-ubuntu1604-v2.13.4.tgz
RUN tar -zxvf mongodb-bi-linux-x86_64-ubuntu1604-v2.13.4.tgz
RUN cp mongodb-bi-linux-x86_64-ubuntu1604-v2.13.4/bin/* /usr/local/bin
RUN chmod -R 755 /usr/local/bin

EXPOSE 3307


