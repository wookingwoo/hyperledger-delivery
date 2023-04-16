# hyperledger-delivery

## install packages

``` bash
cd fabric-samples/fabcar/javascript
npm install
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

## docker log 확인

``` bash
docker logs peer0.org1.example.com
docker logs dev-peer0.org1.example.com-delivery-xxxxxx
```
