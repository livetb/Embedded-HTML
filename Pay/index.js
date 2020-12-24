'use strict'
const config = {
    payments: [{
        "payway": "9",
        "name": "PAYTM",
        "icon": "https://lichat.me/pay_way_paytm826.png",
        "payParams": "paytm_in",
    }, {
        "payway": "11",
        "name": "PhonePe",
        "icon": "https://lichat.me/pay_way_phonepe1123.png",
        "payParams": "wallet_in",
        "more": "10%"
    }, {
        "payway": "8",
        "name": "UPI",
        "icon": "https://lichat.me/pay_way_upi0826.png",
        "payParams": "upi_in",
        "more": "10%"
    }, {
        "payway": "10",
        "name": "EBanking",
        "icon": "https://lichat.me/pay_way_ebanking826.png",
        "payParams": "ebanking_in",
        "more": "10%"
    }, {
        "payway": "1",
        "name": "Credit/Debit Card",
        "icon": "https://lichat.me/pay_way_cards822.png",
        "payParams": "stripe",
        "more": "10%"
    }],
    baseUrl: "https://vfun.mixit.fun",
    showStripe: false,
    stripePaySuccess: false,
    stripeMounted: false,
    params: /\?/gi.test(location.href) ? location.href.split("?")[1].split("-") : null
}
// const stripe = Stripe("pk_test_kKiIIn5jbIixQ96SV4NpPZyf00hulVQYuC");
const stripe = Stripe("pk_live_Zt23ptBqWWJ8as6k2MBUF3xn00XviuaLpZ");

function ajax(url, param, call) {
    if (!config.params[3]) return;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("authorization", config.params[3]);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = "json";
    xhr.send(JSON.stringify(param));
    xhr.timeout = 10 * 1000;

    let result = {};

    xhr.addEventListener("load", function () {
        if (xhr.status !== 200) {
            reject(xhr.status, xhr.statusText, xhr.response);
            result.status = xhr.status;
            result.msg = xhr.statusText;
            result.data = xhr.response;
        }
        else {
            result = xhr.response;
        }
        call(result);
    });
    xhr.addEventListener("error", function (event) {
        console.log("XHRError: ", event);
        result.status = xhr.status;
        result.msg = xhr.statusText;
        result.data = xhr.response;
        call(result);
    })
    xhr.addEventListener("timeout", function () {
        result.status = xhr.status;
        result.msg = "Timeout";
        result.data = xhr.response;
        call(result);
    });
}

function PayByUrl(productIosId, code) {
    if (!config.params[3]) {
        console.log("Param Error");
        return;
    }
    let url = config.baseUrl + "/api/paysession/createN";
    let param = {
        productId: productIosId,
        code: code,
        remark: "webN",
        type: 1
    }

    return new Promise(resolve => {
        ajax(url, param, resolve);
    });
}

function PayByStripe(productIosId) {
    let url = config.baseUrl + "/api/stripe/payment/init";
    let param = {
        remark: "webN",
        type: 1,
        productId: productIosId
    }
    return new Promise(resolve => {
        ajax(url, param, resolve);
    });
}

function renderMethods(arr) {
    let methods = document.getElementById("methods_wrap");
    let methodsHTML = new Array();
    let last = (arr.length % 2 === 1) ? arr.pop() : null;
    let renderMore = (obj) => {
        if (config.params[2] === "more" && obj.more) {
            return `(${obj.more} more)`;
        } else return "";
    }
    for (let i = 0; i < arr.length; i++) {
        if (i % 2 === 0) methodsHTML.push('<div class="line">');
        methodsHTML.push(`
            <label class="item">
                <input type="radio" name="method" value="${arr[i].payParams}"  />
                <div class="method">
                    <span class="icon flexc"><img src="${arr[i].icon}" /></span>
                    <p class="name flexc">
                        <span>${arr[i].name}${renderMore(arr[i])}</span>
                    </p>
                    <span class="choose"><svg width="19px" height="19px" viewBox="0 0 19 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Group 7</title><desc>Created with Sketch.</desc><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Connect" transform="translate(-151.000000, -328.000000)"><g id="Group-12" transform="translate(151.000000, 328.000000)"><g id="Group-7"><circle id="Oval-2" fill="#FF405F" cx="9.5" cy="9.5" r="9.5"></circle><polyline id="Page-1" stroke="#FEFEFE" stroke-width="2.01200008" stroke-linecap="round" stroke-linejoin="round" points="5 9.42841462 8.69066456 13 15 7"></polyline></g></g></g></g></svg></span>
                </div>
            </label>
        `);
        if (i % 2 === 1) methodsHTML.push('</div>');
    }
    if (last) methodsHTML.push(`
    <div class="line one">
        <label class="item">
            <input type="radio" name="method" value="${last.payParams}" />
            <div class="method">
                <span class="icon flexc"><img src="${last.icon}" /></span>
                <p class="name flexc">
                    <span>${last.name}${renderMore(last)}</span>
                </p>
                <span class="choose"><svg width="19px" height="19px" viewBox="0 0 19 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Group 7</title><desc>Created with Sketch.</desc><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Connect" transform="translate(-151.000000, -328.000000)"><g id="Group-12" transform="translate(151.000000, 328.000000)"><g id="Group-7"><circle id="Oval-2" fill="#FF405F" cx="9.5" cy="9.5" r="9.5"></circle><polyline id="Page-1" stroke="#FEFEFE" stroke-width="2.01200008" stroke-linecap="round" stroke-linejoin="round" points="5 9.42841462 8.69066456 13 15 7"></polyline></g></g></g></g></svg></span>
            </div>
        </label>
    </div>
    `);
    methods.innerHTML = methodsHTML.join("");
}
function hideStripe(){
    config.showStripe = false;
    // document.getElementById("pay_button").style.display = "flex";
    document.getElementById("stripe_pay").style.display = "none";
}
function showStripe(clientSecret) {
    config.showStripe = true;
    // document.getElementById("pay_button").style.display = "none";
    document.getElementById("stripe_pay").style.display = "block";
    if(config.stripePaySuccess) return;
    var elements = stripe.elements();
    var style = {
        base: {
            color: "#32325d",
            fontFamily: 'Arial, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
                color: "#32325d"
            }
        },
        invalid: {
            fontFamily: 'Arial, sans-serif',
            color: "#fa755a",
            iconColor: "#fa755a"
        }
    };
    var card = elements.create("card", { style: style });
    // Stripe injects an iframe into the DOM
    card.mount("#card-element");
    card.on("change", function (event) {
        // Disable the Pay button if there are no card details in the Element
        document.querySelector("#submit").disabled = event.empty;
        document.querySelector("#card-error").textContent = event.error ? event.error.message : "";
    });
    var form = document.getElementById("payment-form");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        // Complete payment when the submit button is clicked
        payWithCard(stripe, card, clientSecret);
    });

    var payWithCard = function (stripe, card, clientSecret) {
        loading(true);
        stripe
            .confirmCardPayment(clientSecret, {
                payment_method: {
                    card: card
                }
            })
            .then(function (result) {
                if (result.error) {
                    // Show error to your customer
                    showError(result.error.message);
                } else {
                    // The payment succeeded!
                    orderComplete(result.paymentIntent.id);
                }
            });
    };
    /* ------- UI helpers ------- */
    // Shows a success message when the payment is complete
    var orderComplete = function (paymentIntentId) {
        loading(false);
        config.stripePaySuccess = true;
        document
            .querySelector(".result-message a")
            .setAttribute(
                "href",
                "https://dashboard.stripe.com/test/payments/" + paymentIntentId
            );
        document.querySelector(".result-message").classList.remove("hidden");
        document.querySelector("#submit").disabled = true;
        document.getElementById("payment-form").remove();
    };
    // Show the customer the error from Stripe if their card fails to charge
    var showError = function (errorMsgText) {
        loading(false);
        var errorMsg = document.querySelector("#card-error");
        errorMsg.textContent = errorMsgText;
        setTimeout(function () {
            errorMsg.textContent = "";
        }, 4000);
    };
    // Show a spinner on payment submission
    var loading = function (isLoading) {
        if (isLoading) {
            // Disable the button and show a spinner
            document.querySelector("#submit").disabled = true;
            document.querySelector("#spinner").classList.remove("hidden");
            document.querySelector("#submit-text").classList.add("hidden");
        } else {
            document.querySelector("#submit").disabled = false;
            document.querySelector("#spinner").classList.add("hidden");
            document.querySelector("#submit-text").classList.remove("hidden");
        }
    };
    config.stripeMounted = true;
}

window.addEventListener("load", function () {
    document.getElementById("money").innerText = config.params[1];
    renderMethods(config.payments);
    document.querySelectorAll("input[name=method]").forEach(ele => {
        ele.addEventListener("change", async function(){
            console.log(this.value, this.checked);
            if(!this.checked) return;
            // if(this.value !== "stripe") hideStripe(); 
            // else if(config.stripePaySuccess || config.stripeMounted) showStripe();
            let res = null;
            document.getElementById("load-pay").style.display ="flex";
            if(this.value === "stripe"){
                if(config.stripePaySuccess){
                    showStripe();
                }
                else {
                    res = await PayByStripe(config.params[0]);
                    if (res.status !== 0) {
                        alert("Recharge Failed.");
                    }
                }
                showStripe(res.data);
            }
            else {
                res = await PayByUrl(config.params[0], this.value);
                console.log("PayByUrl: ", res);
                if (res.status !== 0) {
                    alert("Recharge Failed.");
                }else location.href = res.data.payUrl;
            }
            document.getElementById("load-pay").style.display = "none";
            
        });
    })
    // document.getElementById("pay_button").addEventListener("click", async function () {
    //     let method = document.querySelector("input[name=method]:checked").value;
    //     console.log(method, config.params);
    //     let res = null;
    //     if (method === "stripe") {
    //         if(config.showStripe) return;
    //         if(config.stripePaySuccess){
    //             showStripe();
    //             return;
    //         }
    //         res = await PayByStripe(config.params[0]);
    //         if (res.status !== 0) {
    //             alert("Recharge Failed.");
    //         }
    //         showStripe(res.data);
    //         return;
    //     }
    //     res = await PayByUrl(config.params[0], method);
    //     console.log("PayByUrl: ", res);
    //     if (res.status !== 0) {
    //         alert("Recharge Failed.");
    //         return;
    //     }
    //     location.href = res.data.payUrl;
    // });
});