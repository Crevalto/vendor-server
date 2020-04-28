import axios from 'axios'
axios
  .get(
    'https://appyflow.in/api/verifyGST?gstNo=03DOXPM4071K1ZE&key_secret=Q7XEhUtS0aNFOs86TL373jti0Ow1',
  )
  .then((res) => console.log(res.data))
