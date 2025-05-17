const FAQ = () => {
    return (
        <div className="w-10/11 max-w-[1300px] mx-auto">
            <div className='text-center m-10'>
                <h3 className='mb-4 text-indigo-600 font-bold text-4xl '>
                    Frequently Ask Questions

                </h3>
                <p className='text-center text-gray-600'>Got Questions? We ve Got Answers Explore Our FAQ to Make the Most of Nexsy!</p>
            </div>
            <div>
                <div className="collapse collapse-plus bg-base-100 border border-base-300">
                    <input type="radio" name="my-accordion-3" defaultChecked />
                    <div className="collapse-title font-semibold text-xl">What is Nexsy?</div>
                    <div className="collapse-content text-lg">Nexsy is a modern platform where you can discover, upvote, and review the latest digital products and tools. Whether you're a maker or a user, Nexsy connects you to innovation in one place.</div>
                </div>
                <div className="collapse collapse-plus bg-base-100 border border-base-300">
                    <input type="radio" name="my-accordion-3" />
                    <div className="collapse-title font-semibold  text-xl">How can I submit a product on Nexsy?</div>
                    <div className="collapse-content text-lg">To submit a product, simply create an account, go to the "Add Product" section, and fill out the necessary details. If you're on a membership plan, you’ll get additional visibility and features.</div>
                </div>
                <div className="collapse collapse-plus bg-base-100 border border-base-300">
                    <input type="radio" name="my-accordion-3" />
                    <div className="collapse-title font-semibold  text-xl">Is Nexsy free to use?</div>
                    <div className="collapse-content text-lg">Yes! Browsing, upvoting, and reviewing products is completely free. We also offer premium membership plans with added benefits for creators and product marketers.</div>
                </div>
                <div className="collapse collapse-plus bg-base-100 border border-base-300">
                    <input type="radio" name="my-accordion-3" />
                    <div className="collapse-title font-semibold  text-xl">How are featured products selected?</div>
                    <div className="collapse-content text-lg">Featured products are selected based on community upvotes, reviews, and admin curation. The more engagement your product receives, the more likely it is to get featured.</div>
                </div>
                <div className="collapse collapse-plus bg-base-100 border border-base-300">
                    <input type="radio" name="my-accordion-3" />
                    <div className="collapse-title font-semibold text-xl">Can I update or delete my product listing later?</div>
                    <div className="collapse-content text-lg">Absolutely. Once you've posted a product, you can edit or delete it anytime from your dashboard under "My Products."</div>
                </div>
            </div>
        </div>
    )
}

export default FAQ