import logging
import requests
from flask import Flask, render_template, request, redirect, url_for
import json

app = Flask(__name__)


def get_google_function_data(url):
    """
    Request data from a specified google cloud function
    :param url: Trigger url of the google cloud function
    :return: Response data from the cloud function
    """
    request = requests.get(url)
    data = request.json()
    return data
        
def get_orders_data():
    """
    Requests list of orders from a google cloud function
    :return: Response data from the cloud function
    """
    if 'id' in request.args:
        return_orders_function_url = "https://europe-west2-ad-lab-21.cloudfunctions.net/list_orders?id=" + request.args.get('id')
    else:
        return_orders_function_url = "https://europe-west2-ad-lab-21.cloudfunctions.net/list_orders"
    orders = get_google_function_data(return_orders_function_url)
    return orders


@app.route('/')
def login_redirect():
    return redirect(url_for('render_login'))

@app.route('/login')
def render_login():
    return render_template('login.html')

""" USER SECTION """
@app.route('/home')
def render_index():
    return render_template('index.html')

@app.route('/products', methods=["GET"])
def render_products():
    """
    Renders the products page - sends a request to a google cloud function to get products data
    :return:
    """
    list_products_function_url = "https://europe-west2-ad-lab-21.cloudfunctions.net/list_products"
    products_req = requests.post(list_products_function_url, 
    json={"source": "mongo"},
    headers = {"Content-type": "application/json", "Accept": "text/plain"})
    products_data = products_req.json()
    
    return render_template('products.html', products_data=products_data)

@app.route('/product', methods=["GET"])
def render_product():
    """
    Returns a specific product queried by request.args
    :return:
    """
    product_id = request.args.get('id')
    return_product_function_url = "https://europe-west2-ad-lab-21.cloudfunctions.net/return_product?id=" + product_id
    product_data = get_google_function_data(return_product_function_url)

    return render_template('product.html', product_data=product_data)

@app.route('/order', methods=['POST'])
def process_order():
    """
    Creates an order - receives json request of data from client and sends request to google cloud function
    :return:
    """
    order_request_details = request.get_json()
    id = order_request_details['id']
    address = order_request_details['address']
    postcode = order_request_details['postcode']
    product_id = order_request_details['product_id']
    product_price = order_request_details['product_price']
    product_name = order_request_details['product_name']
    product_src = order_request_details['product_src']
    body = {
        "id": id, 
        "address": address, 
        "postcode": postcode, 
        "product_id": product_id, 
        "product_price": product_price, 
        "product_name": product_name, 
        "product_src": product_src
        }

    create_order_function_url = "https://europe-west2-ad-lab-21.cloudfunctions.net/create_order"
    order_req = requests.post(create_order_function_url,
    json=body,
    headers = {"Content-type": "application/json", "Accept": "text/plain"})
    order_data = order_req.json()
    return json.dumps(order_data), 200
    

@app.route('/orders')
def render_orders():
    """
    Render orders page using orders data
    :return:
    """
    orders = get_orders_data()
    return render_template('orders.html', orders=orders)


@app.route('/track', methods=['POST'])
def track_order():
    """
    Sends a request to a google cloud function to track a specific order by ID
    :return: Request data of the item returned by google cloud function
    """
    order_number_request = request.get_json()
    order_number = order_number_request['order_number']

    track_order_function_url = "https://europe-west2-ad-lab-21.cloudfunctions.net/track_order"
    track_req = requests.post(track_order_function_url,
    json={"order_number": order_number},
    headers = {"Content-type": "application/json", "Accept": "text/plain"})
    order_data = track_req.json()

    if order_data == []:
        return "", 400 # error status
    else:
        return json.dumps(order_data[0])


"""ADMIN SECTION """
@app.route('/admin')
def render_admin():
    return render_template('admin.html')

@app.route('/admin/orders')
def render_admin_orders():
    orders = get_orders_data()
    return render_template('adminOrders.html', orders=orders)

@app.route('/admin/update', methods=['POST'])
def update_order():
    """
    Send a request to a google cloud function to update a specific order
    request.get_json(): Contains the order to edit and the details to update
    :return:
    """
    updated_order_details = request.get_json()

    update_order_function_url = "https://europe-west2-ad-lab-21.cloudfunctions.net/update_order"
    requests.post(update_order_function_url,
    json=updated_order_details,
    headers = {"Content-type": "application/json", "Accept": "text/plain"})

    return "", 200

@app.route('/admin/delete', methods=['DELETE'])
def delete_order():
    """
    Delete a specific order specified by request.args
    :return:
    """
    order_id = request.args.get('id')
    delete_order_function_url = "https://europe-west2-ad-lab-21.cloudfunctions.net/delete_order?id=" + order_id
    requests.get(delete_order_function_url)

    return "", 200


""" ERROR HANDLERS """
@app.errorhandler(500)
def server_error(e):
    logging.exception('An error occurred during a request')
    return e, 500

@app.errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404

if __name__ == "__main__":
    app.run(host = "127.0.0.1", port = 8080, debug = True)
    