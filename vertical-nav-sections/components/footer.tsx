import { Github, Linkedin, Twitter } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">Builtt</h3>
            <p className="text-sm">Empowering Your Digital Presence</p>
          </div>
          <div className="flex space-x-4">
            <a
              href="https://github.com/builtt"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-foreground"
            >
              <Github size={24} />
            </a>
            <a
              href="https://linkedin.com/company/builtt"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-foreground"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="https://twitter.com/builtt"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-foreground"
            >
              <Twitter size={24} />
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Builtt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

