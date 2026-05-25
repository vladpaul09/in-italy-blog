import { Metadata } from "next";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import Header from "@/components/UI/Header";
import HeaderInfo from "@/components/Shared/HeaderInfo";
import getStaticStrings from "@/data/getStaticStrings.data";
import stripText from "@/utils/stripText";
import config from "@/config";
import ExcellentCrafterForm from "@/components/PageSrc/ExcellentCrafter/ExcellentCrafterForm";
import { generatePageMetadata } from "@/utils/generateMetadata.util";

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const staticStrings = await getStaticStrings(locale);
  return generatePageMetadata({
    title: "Diventa Excellent Crafter",
    description:
      "Ogni bottega, ogni laboratorio, ogni piccolo marchio custodisce un sapere autentico. inITALY nasce per valorizzare le realtà artigianali e territoriali, raccontando al grande pubblico le storie, i prodotti e le tradizioni che rendono unica l'Italia.",
    image: "/statics/website/diventa-excellent-crafter/cover.jpg",
    url: `/${locale}/diventa-excellent-crafter`,
  });
}

export default async function DiventaAmbassadorPage({ params }: Props) {
  const { locale } = await params;

  const staticStrings = await getStaticStrings(locale);

  const imagesMasonry = [
    {
      img: "/statics/website/diventa-excellent-crafter/Risorsa 3-100.jpg",
      title: "Breakfast",
      rows: 1,
      cols: 1,
    },
    {
      img: "/statics/website/diventa-excellent-crafter/Risorsa 4-100.jpg",
      title: "Burger",
      rows: 1,
      cols: 1,
    },
    {
      img: "/statics/website/diventa-excellent-crafter/Risorsa 5-100.jpg",
      title: "Camera",
      rows: 1,
      cols: 1,
    },
    {
      img: "/statics/website/diventa-excellent-crafter/Risorsa 7-100.jpg",
      title: "Coffee",
      rows: 1,
      cols: 1,
    },

    {
      img: "/statics/website/diventa-excellent-crafter/Risorsa 8-100.jpg",
      title: "Honey",
      rows: 1,
      cols: 1,
    },
    {
      img: "/statics/website/diventa-excellent-crafter/Risorsa 9-100.jpg",
      title: "Basketball",
      rows: 1,
      cols: 1,
    },
  ];

  const srcset = (image: string, size: number, rows = 1, cols = 1) => {
    return {
      src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format&dpr=2 2x`,
    };
  };

  return (
    <>
      <Header staticStrings={staticStrings} bgImage="/statics/website/diventa-excellent-crafter/cover.jpg">
        <HeaderInfo title="Diventa Excellent Crafter" />
      </Header>
      <div className="container section-padding-top-mobile md:section-padding-top-desktop">
        <div className="grid grid-cols-12 gap-x-column-mobile md:gap-x-column-desktop gap-y-row-mobile md:gap-y-row-desktop">
          <div className="col-span-12">
            <Typography
              variant="h3"
              fontWeight={config.fontWeightTitleDefault}
              fontSize={{ xs: config.fontSizeSubtitleSectioMobile, md: config.fontSizeSubtitleSectionDesktop }}
            >
              {stripText(staticStrings.diventaAmbassadorTitle || "DIAMO VOCE ALLE ECCELLENZE")}
            </Typography>
          </div>
          <div className="col-span-12 grid grid-cols-subgrid gap-4 bg-primary-light global-border-radius">
            <div className="col-span-12 lg:col-span-6 order-2 lg:order-1">
              <div className="p-6">
                <p className="font-normal">
                  Ogni bottega, ogni laboratorio, ogni piccolo marchio custodisce un sapere autentico, ma troppo spesso resta nell&apos;ombra per
                  mancanza di strumenti e visibilità. inITALY nasce proprio per questo: valorizzare le realtà artigianali e territoriali, raccontando
                  al grande pubblico le storie, i prodotti e le tradizioni che rendono unica l&apos;Italia — dalle mete turistiche più note ai borghi
                  meno conosciuti, alle eccellenze artigianali più ricercate ed esclusive.
                </p>
                <p className="mt-4 italic">Con noi la tua voce arriva lontano.</p>
                <p className="font-bold text-[16px] mt-4">Dal tuo laboratorio alle case di tutto il mondo</p>
                <p className="mt-4">
                  Il marketplace di inITALY unisce l&apos;Italia più autentica, quella dei piccoli produttori, degli artigiani, delle mani che creano
                  con passione e danno vita a sapori veri, rappresentando le eccellenze del territorio.
                </p>
                <p className="mt-4">
                  Permette di acquistare direttamente prodotti tipici e manufatti locali, sostenendo in modo concreto produttori, artigiani e imprese
                  del Made in Italy. A ciò si affianca un servizio logistico e commerciale integrato, che collega i produttori ai consumatori finali,
                  con una gestione semplice ma che garantisca consegne rapide, tracciabili e affidabili su tutto il territorio nazionale.
                </p>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6 flex order-1 lg:order-2">
              <figure
                className="global-border-radius overflow-hidden w-full h-full m-0 relative min-h-[400px] lg:min-h-0"
                aria-label="Artigiana sorridente con un oggetto in ceramica tra le mani"
              >
                <Image
                  src="/statics/website/diventa-excellent-crafter/Risorsa 2-100.jpg"
                  alt="Artigiana sorridente mostra un manufatto in ceramica davanti al suo laboratorio"
                  fill
                  sizes="(min-width: 1200px) 50vw, 100vw"
                  className="object-cover"
                />
              </figure>
            </div>
          </div>
          <div className="col-span-12 hidden lg:block">
            <div className="flex flex-row justify-center h-full w-full gap-2">
              <div className="flex flex-col w-[29%] xl:w-[25%] gap-2">
                <div className="h-[60px]">
                  <Typography variant="h3" fontWeight={config.fontWeightTitleDefault} fontSize="24px">
                    Qualunque sia il tuo mondo, qui trova spazio.
                  </Typography>
                </div>
                <div className="relative w-full h-[466px]">
                  <Image
                    src="/statics/website/diventa-excellent-crafter/Risorsa 3-100.jpg"
                    alt="Artigiana sorridente mostra un manufatto in ceramica davanti al suo laboratorio"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-full h-[466px]">
                  <Image
                    src="/statics/website/diventa-excellent-crafter/Risorsa 7-100.jpg"
                    alt="Artigiana sorridente mostra un manufatto in ceramica davanti al suo laboratorio"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col w-[25%] xl:w-[25%] gap-2">
                <div className="relative w-full h-[500px]">
                  <Image
                    src="/statics/website/diventa-excellent-crafter/Risorsa 4-100.jpg"
                    alt="Artigiana sorridente mostra un manufatto in ceramica davanti al suo laboratorio"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-full h-[500px]">
                  <Image
                    src="/statics/website/diventa-excellent-crafter/Risorsa 8-100.jpg"
                    alt="Artigiana sorridente mostra un manufatto in ceramica davanti al suo laboratorio"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col w-[45%] xl:w-[60%] gap-2">
                <div className="relative w-full h-[331px]">
                  <Image
                    src="/statics/website/diventa-excellent-crafter/Risorsa 5-100.jpg"
                    alt="Artigiana sorridente mostra un manufatto in ceramica davanti al suo laboratorio"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-full h-[331px]">
                  <Image
                    src="/statics/website/diventa-excellent-crafter/Risorsa 6-100.jpg"
                    alt="Artigiana sorridente mostra un manufatto in ceramica davanti al suo laboratorio"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-full h-[331px]">
                  <Image
                    src="/statics/website/diventa-excellent-crafter/Risorsa 9-100.jpg"
                    alt="Artigiana sorridente mostra un manufatto in ceramica davanti al suo laboratorio"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 block lg:hidden">
            <Typography
              variant="h3"
              fontWeight={config.fontWeightTitleDefault}
              fontSize={{ xs: config.fontSizeSubtitleSectioMobile, md: config.fontSizeSubtitleSectionDesktop }}
            >
              Qualunque sia il tuo mondo, qui trova spazio.
            </Typography>
          </div>
          <div className="col-span-12 block lg:hidden">
            <Image
              src="/statics/website/diventa-excellent-crafter/totale.png"
              alt="Collage di artigiani e mestieri tradizionali italiani"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
          </div>
          <div className="col-span-12">
            <Typography
              variant="h3"
              fontWeight={config.fontWeightTitleDefault}
              fontSize={{ xs: config.fontSizeSubtitleSectioMobile, md: config.fontSizeSubtitleSectionDesktop }}
              className="text-center"
            >
              PERCHÉ DIVENTARE EXCELLENT CRAFTER?
            </Typography>
          </div>
          <div className="col-span-12 grid grid-cols-subgrid gap-4 bg-primary-light global-border-radius">
            <div className="col-span-12 lg:col-span-6 flex order-1 min-h-[400px]">
              <figure
                className="global-border-radius overflow-hidden w-full h-full m-0 relative min-h-[400px] lg:min-h-0"
                aria-label="Vetraio al lavoro che modella il vetro fuso"
              >
                <Image
                  src="/statics/website/diventa-excellent-crafter/Risorsa 10-100.jpg"
                  alt="Vetraio esperto che lavora il vetro fuso nel suo laboratorio"
                  fill
                  sizes="(min-width: 1200px) 50vw, 100vw"
                  className="object-cover"
                />
              </figure>
            </div>
            <div className="col-span-12 lg:col-span-6 order-2">
              <div className="flex flex-col justify-center h-full">
                <div className="p-6 bg-primary-light">
                  <p className="mt-0">Unisciti a noi per diventare ambasciatore di tradizione, cultura e innovazione.</p>
                  <p className="mt-4">
                    Diventare Excellent Crafter significa dare valore al tuo talento e portarlo dove non avresti mai pensato. Initaly rappresenta una
                    vetrina internazionale, pensata per chi crea non solo con le mani, ma soprattutto con il cuore.
                  </p>
                  <p className="mt-4">
                    Se credi nella qualità, nelle storie vere, nella forza delle radici, allora sei nel posto giusto. Il mondo ha bisogno di ciò che
                    sai fare: è il momento di mostrarlo.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12">
            <div className="flex flex-col justify-center space-y-4 mb-8">
              <p className="text-center">Nessun costo di iscrizione.</p>
              <p className="text-center">Nessun canone mensile.</p>
              <p className="text-center">Visibilità internazionale.</p>
              <p className="text-center">Gestione semplice.</p>

              <button
                className="bg-primary text-white font-bold uppercase px-8 py-4 rounded-2xl text-lg hover:opacity-90 transition-opacity"
                aria-label="PAGHI SOLO QUELLO CHE VENDI"
              >
                PAGHI SOLO QUELLO CHE VENDI.
              </button>
            </div>
          </div>
          <div className="col-span-12">
            <Image
              src="/statics/website/diventa-excellent-crafter/Risorsa 11-100.jpg"
              alt="Artigiana sorridente mostra un manufatto in ceramica davanti al suo laboratorio"
              width={1200}
              height={800}
              className="w-full h-auto"
              quality={100}
            />
          </div>
          <div className="col-span-12">
            <Typography
              variant="h3"
              fontWeight={config.fontWeightTitleDefault}
              fontSize={{ xs: config.fontSizeSubtitleSectioMobile, md: config.fontSizeSubtitleSectionDesktop }}
            >
              COME FUNZIONA?
            </Typography>
          </div>
          <div className="col-span-12 grid grid-cols-subgrid gap-4">
            <div className="col-span-12 lg:col-span-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-lg mb-1">1. Registrati tramite il form.</h4>
                  <p className="text-gray-600">Ti contatteremo noi!</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">2. Creeremo la tua pagina personale.</h4>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">3. Caricheremo i tuoi prodotti.</h4>
                  <p className="text-gray-600">Attendi gli ordini: li riceverai in maniera diretta.</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">4. Imballa il prodotto.</h4>
                  <p className="text-gray-600">Ti forniremo carta velina e nastro brandizzati inITALY.</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">5. Consegna l&apos;ordine al corriere.</h4>
                  <p className="text-gray-600">Ci occuperemo noi della spedizione e del cliente finale.</p>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6 flex items-center justify-center">
              <Image
                src="/statics/website/diventa-excellent-crafter/Risorsa 12-100.jpg"
                alt="Scatola brandizzata inITALY con nastro e carta velina"
                width={600}
                height={600}
                className="w-full h-auto global-border-radius"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-primary-light py-8 px-4 mt-8">
        <Typography
          variant="h2"
          fontWeight={config.fontWeightTitleDefault}
          fontSize={{ xs: config.fontSizeMobileTitleSection, md: config.fontSizeDesktopTitleSection }}
          className="text-center uppercase"
        >
          UNISCITI ALLA RETE DELLE ECCELLENZE ITALIANE
        </Typography>
      </div>
      <div className="container section-padding-top-mobile md:section-padding-top-desktop pb-8">
        <div className="grid grid-cols-12 gap-x-column-mobile md:gap-x-column-desktop gap-y-row-mobile md:gap-y-row-desktop">
          <div className="col-span-12">
            <ExcellentCrafterForm staticStrings={staticStrings} locale={locale} />
          </div>
        </div>
      </div>
    </>
  );
}
