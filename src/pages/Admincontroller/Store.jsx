import { useEffect, useState, useRef } from "react";
import Navbar from "../../../componenets/Navbar";
import axiosClient from "../../utils/axiosClient";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import Footer from "../Footer";

const Store = () => {
  const [loading, setLoading] = useState(true);
  const [goodies, setGoodies] = useState([]);
  const [processingId, setProcessingId] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const productsRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const viterazorpaykeyid = import.meta.env.VITE_RAZORPAY_KEY_ID;

  useEffect(() => {
    fetchData();
    loadRazorpayScript();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const fetchData = async () => {
    try {
      const response = await axiosClient.get('/goodies/getallgoodies');
      setGoodies(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBuyClick = async (productId) => {
    setProcessingId(productId);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load");
      }

      const product = goodies.find(p => p._id === productId);
      const response = await axiosClient.post(`/goodies/orderid/${productId}`);
      
      setPaymentDetails({
        productName: product.productName,
        productPrice: product.productPrice,
        productImage: product.productImage
      });
      
      setShowPaymentModal(true);

      const options = {
        key: viterazorpaykeyid,
        amount: response.data.amount,
        currency: "INR",
        order_id: response.data.id,
        handler: async (razorpayResponse,productId) => {
          await verifyPayment(razorpayResponse,productId);
        },
        prefill: {
          name: user?.firstName || "Customer",
          email: user?.email || "customer@example.com",
        },
        theme: {
          color: "#3399cc"
        },
        modal: {
          ondismiss: () => {
            setShowPaymentModal(false);
            setProcessingId(null);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment initialization failed:", err);
      alert("Failed to initialize payment");
      setProcessingId(null);
    }
  };

  const verifyPayment = async (razorpayResponse,productId) => {
    try {
      const { data } = await axiosClient.post('/goodies/paymentverify', {
        productId:productId,
        order_id: razorpayResponse.razorpay_order_id,
        payment_id: razorpayResponse.razorpay_payment_id,
        signature: razorpayResponse.razorpay_signature
      });

      if (data.success) {
        setShowThankYouModal(true);
      } else {
        alert("Payment verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      alert("Error verifying payment");
    } finally {
      setShowPaymentModal(false);
      setProcessingId(null);  
    }
  };

  const closeThankYouModal = () => {
    setShowThankYouModal(false);
    setPaymentDetails(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Navbar />
      
      {/* Hero Section */}
      <div className="hero bg-gradient-to-r from-cyan-700 to-blue-900 text-white py-16">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">Developer Essentials</h1>
            <p className="text-xl mb-8 opacity-90">
              Premium tools and gear to enhance your coding experience
            </p>
            <div className="flex justify-center gap-4">
              <button 
                className="btn bg-cyan-600 hover:bg-cyan-700 text-white border-0 px-8 py-3 text-lg shadow-lg transform transition hover:scale-105"
                onClick={scrollToProducts}
              >
                Explore Products
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-96">
          <span className="loading loading-spinner loading-lg text-cyan-500"></span>
        </div>
      )}

      {/* Product Grid */}
      {!loading && (
        <div className="container mx-auto px-4 py-12" ref={productsRef}>
          <h2 className="text-4xl font-bold text-center mb-12 text-cyan-400">
            Featured Products
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {goodies.map((product) => (
              <div 
                key={product._id} 
                className="card bg-gray-800 shadow-2xl rounded-xl overflow-hidden transform transition-all hover:scale-[1.03] hover:shadow-cyan-900/30 border border-gray-700"
              >
                <figure className="h-72 w-full overflow-hidden bg-gray-900 flex items-center justify-center">
                  {product.productImage ? (
                    <img 
                      src={product.productImage} 
                      alt={product.productName}
                      className="max-h-full max-w-full object-contain p-2"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                </figure>
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-white truncate">{product.productName}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mt-3 line-clamp-2 min-h-[3rem]">
                    {product.productDescription}
                  </p>
                  <div className="flex justify-between items-center mt-5">
                    <span className="text-2xl font-bold text-cyan-400">₹{product.productPrice}</span>
                    <span className={`badge ${product.quantity > 0 ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'} border-0`}>
                      {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                    </span>
                  </div>
                  <div className="mt-5">
                    <button 
                      className={`btn w-full ${
                        product.quantity > 0 
                          ? processingId === product._id 
                            ? 'bg-gray-600 cursor-not-allowed' 
                            : 'bg-cyan-600 hover:bg-cyan-700' 
                          : 'bg-gray-700 cursor-not-allowed'
                      } text-white border-0 transition-all`}
                      onClick={() => handleBuyClick(product._id)}
                      disabled={product.quantity <= 0 || processingId === product._id}
                    >
                      {processingId === product._id ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : product.quantity > 0 ? (
                        'Buy Now'
                      ) : (
                        'Out of Stock'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Banner */}
      <div className="bg-gray-800 py-12 mt-8 border-t border-gray-700">
        <div className="container mx-auto text-center">
          <h3 className="text-2xl font-bold mb-3 text-cyan-400">Need Help Choosing?</h3>
          <p className="max-w-2xl mx-auto mb-6 text-gray-300">
            Our developer gear experts can help you find the perfect tools
          </p>
          <Link to="/contact" className="btn bg-cyan-800 hover:bg-cyan-700 text-white border-0 px-8 py-3 shadow-lg">
            Contact Support
          </Link>
        </div>
      </div>

      {/* Payment Processing Overlay */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-cyan-600 shadow-2xl shadow-cyan-900/50 animate-fadeIn">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Processing Payment</h3>
              <p className="text-gray-300 mb-6">
                Completing your purchase of <span className="font-semibold text-cyan-300">{paymentDetails?.productName}</span>
              </p>
              
              <div className="bg-gray-700 rounded-xl p-4 mb-6 flex items-center">
                <div className="bg-gray-600 rounded-lg w-16 h-16 flex items-center justify-center mr-4">
                  {paymentDetails?.productImage ? (
                    <img 
                      src={paymentDetails.productImage} 
                      alt={paymentDetails.productName}
                      className="max-h-12 max-w-12 object-contain"
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">{paymentDetails?.productName}</p>
                  <p className="text-cyan-400 font-bold">₹{paymentDetails?.productPrice}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-cyan-600 bg-cyan-900">
                        Processing
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-cyan-300">
                        50%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-cyan-900">
                    <div 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-cyan-500 animate-pulse"
                      style={{ width: "50%" }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm italic">
                Please complete the payment in the Razorpay window
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Thank You Modal */}
      {showThankYouModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full border border-cyan-600 shadow-2xl shadow-cyan-900/50 animate-scaleIn">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500 rounded-full opacity-75 animate-ping"></div>
                  <div className="relative bg-cyan-600 rounded-full p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-3">Thank You!</h3>
              <p className="text-cyan-400 text-xl font-medium mb-2">
                Your order is confirmed
              </p>
              
              <div className="bg-gray-700/50 rounded-xl p-5 mb-6 border border-cyan-900">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gray-600 rounded-lg w-20 h-20 flex items-center justify-center mr-4">
                    {paymentDetails?.productImage ? (
                      <img 
                        src={paymentDetails.productImage} 
                        alt={paymentDetails.productName}
                        className="max-h-16 max-w-16 object-contain"
                      />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-lg">{paymentDetails?.productName}</p>
                    <p className="text-cyan-400 font-bold text-xl">₹{paymentDetails?.productPrice}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-600">
                  <div className="text-left">
                    <p className="text-gray-400 text-sm">Order Status</p>
                    <p className="text-green-400 font-medium">Completed</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Payment Method</p>
                    <p className="text-cyan-300 font-medium">Razorpay</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
                <button 
                  onClick={closeThankYouModal}
                  className="btn bg-cyan-600 hover:bg-cyan-700 text-white border-0 px-8 py-3 flex-1 transition-all transform hover:scale-105"
                >
                  Continue Shopping
                </button>
                <button className="btn bg-gray-700 hover:bg-gray-600 text-white border-0 px-8 py-3 flex-1 transition-all">
                  Thank You
                </button>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-700">
                <p className="text-gray-400 text-sm">
                  A confirmation email has been sent to <span className="text-cyan-300">{user?.email || "your email"}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
      <Footer/>
    </div>
  );
};

export default Store;