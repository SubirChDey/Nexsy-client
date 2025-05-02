
const Footer = () => {
  return (
    <div>
      <footer class="bg-gray-900 text-white py-10 px-5">
        <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

          <div>
            <div class="flex items-center space-x-2 mb-2">
              <img src="/logo.png" alt="Nexsy Logo" class="w-8 h-8" />
              <h2 class="text-xl font-semibold">Nexsy</h2>
            </div>
            <p class="text-sm text-gray-400">Discover and launch tech products. Empowering creators and explorers across web apps, AI tools, software, games, and mobile apps.</p>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-2">Contact</h3>
            <p class="text-sm text-gray-400">Email: support@nexsy.com</p>
            <p class="text-sm text-gray-400">Phone: +1 245-548-652</p>
            <p class="text-sm text-gray-400">Location: 320 New York City, New York, USA 52487</p>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-2">Quick Links</h3>
            <ul class="space-y-1 text-sm text-gray-400">
              <li><a href="#" class="hover:text-white">Submit a Product</a></li>
              <li><a href="#" class="hover:text-white">Explore</a></li>
              <li><a href="#" class="hover:text-white">Login / Register</a></li>
              <li><a href="#" class="hover:text-white">Premium Plans</a></li>
            </ul>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-2">Follow Us</h3>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-white" aria-label="Facebook">Facebook</a>
              <a href="#" class="text-gray-400 hover:text-white" aria-label="Twitter">Twitter</a>
              <a href="#" class="text-gray-400 hover:text-white" aria-label="LinkedIn">LinkedIn</a>
              <a href="#" class="text-gray-400 hover:text-white" aria-label="GitHub">GitHub</a>
            </div>
          </div>
        </div>

        <div class="mt-10 text-center text-sm text-gray-500">
          &copy; 2025 Nexsy. All rights reserved.
        </div>
      </footer>

    </div>
  )
}

export default Footer