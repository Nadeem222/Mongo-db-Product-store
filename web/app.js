
const url = window.location.href;
let baseUrl = "";

if (url.split(":")[0] === 'https') {
    baseUrl = 'https://nice-pantyhose-cod.cyclic.app/';
} else {
    baseUrl = 'http://localhost:5001';
}






let addProduct = () => {

    let name = document.querySelector("#name").value
    let price = document.querySelector("#price").value
    let cat = document.querySelector("#cat").value
    let desc = document.querySelector("#desc").value

    axios.post(`${baseUrl}/product`, {
        name: name,
        price: price,
        category: cat,
        description: desc
    })
        .then(function (response) {
            // handle success
            console.log("response is success");
            console.log(response.data);

            document.querySelector("#result").innerHTML =
                response.data.message

            getAllProducts();

        })
        .catch(function (error) {
            // handle error
            console.log(error);
            document.querySelector("#result").innerHTML =
                error.data.message
        });

}
let getAllProducts = () => {
    axios.get(`${baseUrl}/products`)
        .then(function (response) {
            // handle success
            console.log("response is success");
            console.log(response.data.data);
            document.querySelector("#productList").innerHTML = ""

            response?.data?.data.map((eachProduct, index) => {
                document.querySelector("#productList").innerHTML +=
                    `
                    <div>
                        <h1>${eachProduct.name} </h1>
                        <p>${eachProduct.price} </p>
                        <p>${eachProduct.category} </p>
                        <p>${eachProduct.description} </p>
                        <button onclick="deleteProduct('${eachProduct._id}')">delete </button>
                        <button onclick="editProduct (${eachProduct._id})">Edit</button> 
                    </div>
                    `
            })
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            document.querySelector("#result").innerHTML =
                error.data.message
        })
}
let deleteProduct = (id) => {

    axios.delete(`${baseUrl}/product/${id}`)
        .then(function (response) {
            // handle success
            console.log("response is success");
            console.log(response.data);

            document.querySelector("#result").innerHTML =
                response.data.message

            getAllProducts();

        })
        .catch(function (error) {
            // handle error
            console.log(error);
            document.querySelector("#result").innerHTML =
                error.data.message
        })


}
let editProduct = async (id) => {

    console.log("edit id: ", id)
    document.querySelector(`#form-${id}`).style.display = "inline"

    document.querySelector(`#span-${id}`).style.display = "none"
    document.querySelector(`#delete-${id}`).style.display ="none"
    document.querySelector(`#edit-${id}`).style.display = "none" 
}

let updateProduct = async (id) => {
console.log("update id: ", id)

let updatedText = document.querySelector(`#input-${id}`).value

try {
let response = await axios.put(`${baseUrl}/product/${id}`,
{
text: updatedText
})

document.querySelector("#message").innerHTML = response.data.message
setTimeout(() => {
document.querySelector("#message").innerHTML = ""
}, 2000);

getAllProducts();

} catch (error) {
console.log("error: ", error);
}


}


