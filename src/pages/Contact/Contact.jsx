import { useState } from "react";
import Swal from "sweetalert2";

const Contact = () => {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Swal.fire({
            icon: "success",
            title: "Message Sent!",
            text: "Thanks for reaching out! We'll get back to you shortly.",
            confirmButtonColor: "#6366F1",
        });

        setFormData({ name: "", email: "", message: "" });
    };

    return (
        <section className="min-h-screen bg-gradient-to-br from-white to-gray-100 py-16 px-4 md:px-20">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">Contact Us</h2>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-xl rounded-3xl p-8 space-y-6 border border-gray-200"
                >
                    <h3 className="text-2xl font-semibold text-indigo-600 mb-2">Send us a message</h3>
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Your Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Your Message</label>
                        <textarea
                            name="message"
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
                    >
                        Send Message
                    </button>
                </form>
                <div className="space-y-6">
                    <div className="bg-white shadow-xl rounded-3xl p-8 border border-gray-200">
                        <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Our Contact Info</h3>
                        <p className="text-gray-700 mb-2"><strong>Address:</strong> Tumilia, Kaliganj, Gazipur, Bangladesh</p>
                        <p className="text-gray-700 mb-2"><strong>Email:</strong> contact@nexsy.com</p>
                        <p className="text-gray-700"><strong>Phone:</strong> +880 1930-660293</p>
                    </div>

                    <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-lg">
                        <iframe
                            title="Nexsy Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.154308412749!2d90.56712317594833!3d23.81033238649347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755ddf65ba80dc3%3A0x93ae1ed6b1bb4b16!2sTumilia%20Boys%20Govt%20Primary%20School!5e0!3m2!1sen!2sbd!4v1715925000000!5m2!1sen!2sbd"
                            width="100%"
                            height="300"
                            allowFullScreen=""
                            loading="lazy"
                            className="w-full h-[300px] border-none"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
