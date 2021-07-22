import axios from 'axios'

var postData = (total = 10)=> {
    return {
        "SaleToPOIRequest":{
            "MessageHeader":{
                "ProtocolVersion":"3.0",
                "MessageClass":"Service",
                "MessageCategory":"Payment",
                "MessageType":"Request",
                "SaleID":"POSSystemID12345",
                "ServiceID":Math.floor(Math.random() * Math.floor(10000000)).toString(),
                "POIID":"V400m-346307604"
            },
            "PaymentRequest":{
                "SaleData":{
                    "SaleTransactionID":{
                        "TransactionID":Math.floor(Math.random() * Math.floor(10000000)).toString(),
                        "TimeStamp":new Date().toISOString()
                    },
                    "saleToAcquirerData": "tenderOption=ReceiptHandler&tenderOption=AskGratuity",
                    "saleReferenceID": "saleReferenceID",
                },
                "PaymentTransaction":{
                    "AmountsReq":{
                        "Currency":"EUR",
                        "RequestedAmount":total
                    }
                },
                "paymentData": {
                    "paymentType": "Normal",
                    "splitPaymentFlag": true
                }          
            }
        }
    }
}
  
  let axiosConfig = {
    headers: {
        //"x-API-Key": "AQE9gXvdXN+ML0wU6mmxhmEH9rLIH90dLbBFVXVXyGHlv2JSm8lXE8VuEzl1XKKrSayMf1hI+Jif/iWOzgZJQBDBXVsNvuR83LVYjEgiTGAH-JlDYRP+/zGs0tcjWojBL2/W+tZqjmw3uFwt4kIs5fj0=-Q{Cck)$$[VXfxv6F",
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
    }
  };




const makePayment = async (total) => {
	const response = await axios.post(
        "https://192.168.1.103:8443/nexo", 
        postData(total), 
        axiosConfig
    )
  console.log(response.data.SaleToPOIResponse.PaymentResponse)
  return response.data.SaleToPOIResponse.PaymentResponse
}

export { makePayment }