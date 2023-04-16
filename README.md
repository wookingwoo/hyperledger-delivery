
## Launch the all network

``` bash
cd fabric-samples/fabcar
./startFabric.sh javascript
```

docker container 확인

``` bash
docker container ls
docker ps
```

## install packages

``` bash
cd fabric-samples/fabcar/javascript
npm install
```

## 1. Test-network 실행

### 네트워크 구성

``` bash
cd fabric-samples/test-network
./network.sh down
./network.sh up createChannel -ca -s couchdb
docker container ls
```

## 2. connection-org1.json 파일 복사

네트워크에 연결하기 위해 필요

``` bash
cp fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json delivery
```

## 3. 체인코드 등록

- 체인코드 등록

``` bash
cd delivery
bash deploycc.sh delivery
```

- 기존 wallet 삭제

``` bash
cd delivery
rm -rf wallet
```

- Enroll Admin

``` bash
cd delivery
node enrollAdmin.js
```

- Register User

``` bash
cd delivery
node registerUser.js
```

## 배달자 등록, 조회

### 실행 경로

``` bash
cd delivery/deliveryapp
```

### 등록

``` bash
node invoke.js
```

### 조회

``` bash
node query.js
```

### docker log 확인

``` bash
docker logs peer0.org1.example.com
docker logs dev-peer0.org1.example.com-delivery-xxxxxx
```

## 웹 서버 실행

### 서비 실행

``` bash
cd delivery/deliveryapp
node deliverytest.js
```

### 웹 브라우저에서 접속

```
deliverymain.html
```

## 참조

fabric-sdk-node 2.2 버전 참조

<https://hyperledger.github.io/fabric-sdk-node/>
