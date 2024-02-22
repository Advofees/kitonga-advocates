import {
  faArrowUpRightDots,
  faBalanceScaleLeft,
  faBandAid,
  faCheckToSlot,
  faHandcuffs,
  faHome,
  faPassport,
  faPersonShelter,
  faQuoteLeft,
  faScaleBalanced,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { faGavel } from "@fortawesome/free-solid-svg-icons/faGavel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { images } from "../../assets/images/images";
import { useNavigate } from "react-router-dom";
import { BsArrowUpRight } from "react-icons/bs";
import { Carousel, CarouselItem } from "react-bootstrap";
import { StrokeText } from "../common/StrokeText";
import { SpeedCounter } from "../common/SpeedCounter";
import { Glass } from "../common/Glass";

export function LandingPage() {
  const navigate = useNavigate();

  const perfections = [
    {
      icon: faGavel,
      value: 123,
      prefix: "+",
      desc: "Expert Lawyers",
    },
    {
      icon: faScaleBalanced,
      value: 98,
      prefix: "%",
      desc: "Cases Won",
    },
    {
      icon: faHandcuffs,
      value: 9,
      prefix: "%",
      desc: "Cases Dismissed",
    },
    {
      icon: faPersonShelter,
      value: 5000,
      prefix: "+",
      desc: "Trusted Clients",
    },
  ];

  const practiceAreas = [
    {
      title: "Personal Injury",
      description:
        "Physical or emotional harm due to accidents or negligence, seeking compensation and justice",
      icon: faBandAid,
    },
    {
      title: "Family Law",
      description:
        "Legal matters related to family relationships, such as divorce, child custody, and spousal support",
      icon: faUsers,
    },
    {
      title: "Property Law",
      description:
        "Legal issues concerning real estate, property transactions, and land disputes",
      icon: faHome,
    },
    {
      title: "Immigration Law",
      description:
        "Immigration-related matters, including visas, green cards, and asylum applications",
      icon: faPassport,
    },
    {
      title: "Civil Litigation",
      description:
        "Disputes and lawsuits involving contracts, torts, and other civil matters",
      icon: faBalanceScaleLeft,
    },
    {
      title: "Corporate Law",
      description:
        "Legal guidance to businesses on corporate governance, mergers and acquisitions, and regulatory compliance",
      icon: faHandcuffs,
    },
  ];

  const topVerdicts = [
    { title: "Medical Negligence Settlement", pay: "$1.2 Million" },
    { title: "Defective roadway jury verdict", pay: "$1.6 Million" },
    { title: "Trucking accident verdict", pay: "$6.5 Million" },
    { title: "Brain Injury", pay: "$4.3 Million" },
  ];

  const lawyers = [
    {
      name: "John Smith",
      image: images.lawyer1,
    },
    {
      name: "Alice Johnson",
      image: images.lawyer2,
    },
    {
      name: "Michael Davis",
      image: images.lawyer3,
    },
  ];

  const newsUpdates = [
    {
      title: "Damages and Wrongful Convictions",
      image: images.right2,
    },
    {
      title: "Advocacy Tips from Criminal Court Judges",
      image: images.right3,
    },
    {
      title: "An Approach To Advocacy For Our Times",
      image: images.right4,
    },
  ];

  const testimonials = [{}, {}, {}, {}, {}];

  return (
    <div className="container mx-auto">
      <button
        onClick={() => navigate("/dashboard")}
        className="text-amber-500 group font-bold duration-300 text-center text-2xl relative h-12 w-64 m-2"
      >
        Dashboard
      </button>

      {/* Start */}
      <div className="flex flex-col gap-4 items-center justify-center min-h-[50vh] p-6 text-center relative">
        <h3 className="md:text-[3em] text-[1.5em] text-amber-500 dancing">
          KITONGA
        </h3>
        <div className="text-white dancing text-[3em] xl:text-[5em]">
          We create tunnels from hell to heaven
        </div>
        <button className="bg-amber-600 text-white md:text-xl p-4 flex items-center gap-4 hover:ring-1 hover:ring-amber-500 hover:bg-transparent hover:text-amber-500 duration-200">
          RECENT WORK <FontAwesomeIcon icon={faArrowUpRightDots} />
        </button>
      </div>
      {/* End */}

      {/* Start */}
      <div className="relative grid  md:grid-cols-2 xxl:grid-cols-4 sm:w-max sm:mx-auto gap-4 p-4">
        {perfections.map((perfection, index) => (
          <Glass
            contentClassName="bg-white/10"
            key={index}
            className="sm:min-w-[20rem] backdrop-blur-sm sm:max-w-[20rem] p-4 flex flex-col items-center bg-black/25 relative"
          >
            <div className="text-[3em] absolute right-2 top-2 w-16 h-16 flex items-center justify-center font-extrabold font-mono">
              <StrokeText
                sz={2}
                fillColor="transparent"
                strokeColor="rgb(245, 158, 11, .5)"
                text={`0${index + 1}`}
              />
            </div>
            <div className="h-24 w-24 text-amber-500 flex items-center justify-center text-4xl">
              <FontAwesomeIcon icon={perfection.icon} />
            </div>
            <h3 className="dancing text-[4em] text-white">
              <StrokeText
                sz={1}
                fillColor="transparent"
                strokeColor="white"
                text={
                  <div className="flex items-center">
                    <SpeedCounter value={perfection.value} />
                    {perfection.prefix}
                  </div>
                }
              />
            </h3>
            <h4 className="text-gray-400">{perfection.desc}</h4>
          </Glass>
        ))}
      </div>
      {/* End */}

      {/* Start */}
      <div className="grid lg:grid-cols-2 mt-28 p-6 gap-6">
        <div className="relative h-96 lg:h-auto">
          <div className="absolute z-10 flex -top-8 right-[45%] bottom-8 left-0">
            <Glass
              contentClassName=""
              className="flex flex-grow p-2 bg-white/10 backdrop-blur"
            >
              <div className="flex-grow h-full">
                <img
                  className="w-full h-full object-cover"
                  src={images.right4}
                />
              </div>
            </Glass>
          </div>
          <div className="absolute flex -top-16 right-0 bottom-[50%] left-[40%]">
            <Glass
              contentClassName=""
              className="flex flex-grow p-2 bg-white/10 backdrop-blur"
            >
              <div className="flex-grow h-full">
                <img
                  className="w-full h-full object-cover"
                  src={images.right2}
                />
              </div>
            </Glass>
          </div>
          <div className="absolute flex top-[30%] -right-4 -bottom-4 left-[60%]">
            <Glass
              contentClassName=""
              className="flex flex-grow p-2 bg-white/10 backdrop-blur"
            >
              <div className="flex-grow h-full">
                <img
                  className="w-full h-full object-cover"
                  src={images.right1}
                />
              </div>
            </Glass>
          </div>
        </div>
        <div className="p-4 grid gap-4">
          <h4 className="text-amber-600 font-thin text-2xl pl-4">
            Dedicated Law Practitioners{" "}
          </h4>
          <p className="font-serif text-4xl my-6 font-bold text-white">
            Exceptional Legal Services and Guidance
          </p>

          <p className="text-gray-300">
            With a deep understanding of the legal system and a track record of
            success, we are your trusted advocates in matters of family law,
            criminal defense, personal injury.
          </p>

          <div>
            <h3 className="text-gray-300">
              We offer unwavering commitment to clients with:
            </h3>
            <div className="text-gray-300 font-bold flex pl-4 items-center gap-4 mt-2 ">
              <span className="h-9 w-9 flex items-center justify-center text text-amber-600 hover:text-white duration-200 hover:bg-amber-600 border-1 border-amber-600">
                <FontAwesomeIcon icon={faCheckToSlot} />
              </span>
              <span>Personalized solutions</span>
            </div>
            <div className="text-gray-300 font-bold flex pl-4 items-center gap-4 mt-2 ">
              <span className="h-9 w-9 flex items-center justify-center text text-amber-600 hover:text-white duration-200 hover:bg-amber-600 border-1 border-amber-600">
                <FontAwesomeIcon icon={faCheckToSlot} />
              </span>
              <span>Clear communication</span>
            </div>
            <div className="text-gray-300 font-bold flex pl-4 items-center gap-4 mt-2 ">
              <span className="h-9 w-9 flex items-center justify-center text text-amber-600 hover:text-white duration-200 hover:bg-amber-600 border-1 border-amber-600">
                <FontAwesomeIcon icon={faCheckToSlot} />
              </span>
              <span>Results driven approach</span>
            </div>

            <p className="mt-6 text-gray-300">
              to help you navigate complex legal issues with confidence and
              peace of mind.
            </p>

            <div className="mt-6 flex justify-center">
              <div className="flex items-end gap-4">
                <div className="h-24 w-24 rounded-full overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={images.ceo}
                  />
                </div>
                <div>
                  <h4 className="dancing text-2xl italic text-gray-300">
                    Sherlley Powers
                  </h4>
                  <h4 className="text-amber-500">CEO / Founder</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End */}

      {/* Start */}
      <div className="p-4 my-28">
        <h3 className="text-center dancing text-[4em] text-amber-500">
          Practice Areas
        </h3>
        <div className="relative lg:mt-28 grid lg:grid-cols-2 lg:gap-12 xl:gap-y-28 sm:w-max sm:mx-auto xl:gap-x-[20rem] xxl:gap-x-[30rem] py-12">
          <div className="z-10 rounded-[20px] overflow-hidden hidden lg:flex absolute -top-16 left-[30rem] right-[30rem] -bottom-16">
            <Glass className="p-2 flex-grow bg-white/10 backdrop-blur">
              <img
                className="h-full w-full object-cover hidden xl:block"
                src={images.right3}
              />
            </Glass>
          </div>
          {practiceAreas.map((area, index) => (
            <div
              className={`z-20 group sm:min-w-[25rem] ${
                index % 2 === 0 ? "r-to-l" : ""
              } sm:max-w-[30rem] flex gap-6 ${
                index !== practiceAreas.length - 1 && ""
              } lg:border-none`}
              key={index}
            >
              <Glass className="bg-white/10 backdrop-blur-sm text-amber-600 min-w-[8rem]">
                <span className="text-2xl group-hover:text-amber-600 flex-grow h-full flex items-center justify-center">
                  <FontAwesomeIcon icon={area.icon} />
                </span>
              </Glass>
              <div className="flex-grow py-4">
                <h4 className="flex gap-4 items-center text-amber-600">
                  <span className="text-2xl dancing italic">{area.title}</span>
                </h4>
                <div className="text-white h-24 py-4">{area.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* End */}

      {/* Start */}
      <div className="flex relative my-[10em] min-h-[52vh] md:mt-[20em]">
        <div className="relative flex-grow">
          <div className="flex absolute overflow-hidden left-4 -top-8 -bottom-8 lg:right-[40%] right-[10%]">
            <Glass className="z-10 bg-white/10 backdrop-blur p-2 rounded-[20px] overflow-hidden">
              <img
                className="w-full h-full object-cover rounded-[20px]"
                src={images.right3}
              />
            </Glass>
          </div>
        </div>
        <div className="absolute z-20 flex lg:left-[40%] left-[10%] bottom-0 top-0 right-4">
          <Glass
            contentClassName="rounded-[20px]"
            className="flex-grow p-8 rounded-[20px] overflow-hidden bg-white/10 backdrop-blur"
          >
            <h4 className="dancing text-[2em] text-gray-300 italic">
              What our Clients Say About us
            </h4>
            <Carousel interval={5000} controls={false} data-bs-theme="light">
              {testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={index}
                  style={{ minHeight: "40vh" }}
                  className="p-4"
                >
                  <div className="absolute inset-0 flex">
                    <div className="relative flex flex-col flex-grow">
                      <div className="gap-4 flex flex-col pr-4 flex-grow">
                        <span className="text-4xl text-amber-500">
                          <FontAwesomeIcon icon={faQuoteLeft} />
                        </span>
                        <div className="pt-8 relative flex-grow">
                          <div className="absolute top-0 bottom-[40%] overflow-hidden text-white font-bold">
                            Aut excepturi esse. Nisi necessitatibus voluptate.
                            Nemo aut aperiam. Repellat maiores voluptatum. Nam
                            incidunt facilis. Itaque aperiam ea.Aut excepturi
                            esse. Nisi necessitatibus voluptate. Nemo aut
                            aperiam. Repellat maiores voluptatum. Nam incidunt
                            facilis. Itaque aperiam ea.Aut excepturi esse. Nisi
                            necessitatibus voluptate. Nemo aut aperiam. Repellat
                            maiores voluptatum. Nam incidunt facilis. Itaque
                            aperiam ea.Aut excepturi esse. Nisi necessitatibus
                            voluptate. Nemo aut aperiam. Repellat maiores
                            voluptatum. Nam incidunt facilis. Itaque aperiam
                            ea.Aut excepturi esse. Nisi necessitatibus
                            voluptate. Nemo aut aperiam.
                          </div>
                        </div>
                      </div>
                      <Carousel.Caption>
                        <div className="flex gap-4 items-center">
                          <div className="h-16 w-16 rounded-full ring-4 ring-black overflow-hidden">
                            <img
                              className="w-full h-full object-cover"
                              src={images.aiLady}
                            />
                          </div>
                          <div className="dancing text-lg">
                            <h4 className="font-bold text-black">Kim Crepea</h4>
                            <h4 className="text-white italic">Designer</h4>
                          </div>
                        </div>
                      </Carousel.Caption>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </Carousel>
          </Glass>
        </div>
      </div>
      {/* End */}

      {/* Start */}
      <div className="grid relative container mx-auto">
        <h4 className="text-center dancing text-[4em] text-amber-500">
          Top Verdicts
        </h4>
        <div>
          {topVerdicts.map((verdict, index) => (
            <div
              className="flex border-b border-amber-700/25 p-4 items-center"
              key={index}
            >
              <div className="w-32 h-32 rounded-lg overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={images.right2}
                />
              </div>
              <div className="flex flex-col md:flex-row flex-grow">
                <div className="text-gray-300 text-xl px-4">
                  {verdict.title}
                </div>
                <div className="border-b hidden px-4 border-dashed border-amber-700/75 md:block flex-grow"></div>
                <div className="px-4 text-amber-500 text-xl dancing italic font-bold">
                  {verdict.pay}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* End */}

      {/* Start */}
      <div className="my-24">
        <h4 className="dancing text-center text-4xl py-4 text-amber-500">
          Meet Our Expert Lawyers
        </h4>
        <div className="flex flex-col md:flex-row mx-auto w-max gap-4">
          {lawyers.map((lawyer, i) => (
            <div
              className="h-[35vh] w-64 flex relative border-1 border-amber-600/25"
              key={i}
            >
              <div className="absolute inset-0">
                <img
                  className="w-full h-full object-cover"
                  src={lawyer.image}
                />
              </div>
              <div className="flex w-full justify-end flex-col z-20 p-4 bg-gradient-to-t from-black to-transparent">
                <div className="text-amber-700 font-bold text-xl">
                  {lawyer.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* End */}

      {/* Start */}
      <div className="my-24">
        <h4 className="dancing text-center text-4xl py-4 text-amber-500">
          Our Latest News Updates
        </h4>
        <div className="flex flex-col md:flex-row mx-auto w-max gap-4">
          {newsUpdates.map((newsUpdate, i) => (
            <div
              className="h-[35vh] w-64 flex relative border-1 border-amber-600/25"
              key={i}
            >
              <div className="absolute inset-0">
                <img
                  className="w-full h-full object-cover"
                  src={newsUpdate.image}
                />
              </div>
              <div className="flex justify-end flex-col z-20 p-4 bg-gradient-to-t from-black to-transparent">
                <div className="text-white font-bold">{newsUpdate.title}</div>
                <button className="text-amber-600 font-bold flex items-center gap-2">
                  Read More <BsArrowUpRight />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* End */}
    </div>
  );
}
