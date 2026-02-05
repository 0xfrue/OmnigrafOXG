"use client";

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 mt-auto bg-gradient-to-b from-transparent to-base-blue/5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} OmnigrafOXG. Advancing graphene research through community.
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Powered by</span>
              <svg className="w-4 h-4" viewBox="0 0 111 111" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 22.1714 0 50.3923H72.8467V59.6416H0C2.35281 87.8625 26.0432 110.034 54.921 110.034Z" fill="#0052FF"/>
              </svg>
              <span className="text-xs font-semibold text-base-blue">Base</span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <a
              href="https://twitter.com/omnigraph"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Twitter
            </a>
            <a
              href="https://discord.gg/omnigraph"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Discord
            </a>
            <a
              href="https://docs.omnigraph.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Docs
            </a>
            <a
              href="https://basescan.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              BaseScan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
