import axios from 'axios'
async function checkGSTIN(gstin_number) {
  const gstin_secret = process.env.GSTIN_SECRET
  const req = await axios.get(
    `https://appyflow.in/api/verifyGST?gstNo=${gstin_number}&key_secret=${gstin_secret}`,
  )
  console.log(req.data)
}

checkGSTIN('03DOXPM4071K1ZE')
