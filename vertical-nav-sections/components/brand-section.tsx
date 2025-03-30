import Image from "next/image"

const BrandSection = () => {
  return (
    <section className="min-h-screen bg-secondary text-secondary-foreground relative flex flex-col items-center justify-center py-16">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20at%20Jan%2029%2018-26-41-IGtYeeJqbYuvdfCzk59kayyycbIhq4.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.2,
        }}
      />
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col items-center space-y-16">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
            <Image src="/placeholder.svg" alt="Tesla Logo" width={200} height={60} className="w-48 md:w-64" />
            <span className="text-4xl font-light">×</span>
            <div className="flex flex-col items-center">
              <Image src="/placeholder.svg" alt="Builtt Logo" width={200} height={60} className="w-48 md:w-64" />
              <span className="text-sm mt-2">powered by Degordian</span>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-center font-light max-w-4xl mx-auto leading-relaxed">
            Empowering Your Brand with Scalable and High-Performance Web Solutions
          </h2>
        </div>
      </div>
    </section>
  )
}

export default BrandSection

