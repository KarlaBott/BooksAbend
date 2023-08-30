import axios from "axios";
import swal from "sweetalert";

export async function addOneItemToCart(product) {
  console.log("axios addOneItemToCart", product);
  try {
    const { data } = await axios.post("api/orders", {
      userid: sessionStorage.getItem("BWUSERID"),
      productid: product.id,
      itemprice: product.price,
      quantity: 1,
    });
    console.log("axios add > data:", data);
    data.success = false;
    if (data?.orderDetail) {
      if (data?.orderDetail[0]?.message == "NOT_ENOUGH") {
        console.log("not enough");
        swal("", "No more available!", "error", {
          button: false,
          timer: 1600,
        });
      } else {
        data.success = true;
        swal("", "Added to Cart!", "success", {
          button: false,
          timer: 1000,
        });
      }
    }
    return data;
  } catch (error) {
    console.error(`An error occured when adding item to cart.`);
  }
}
