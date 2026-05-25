import { Metadata } from "next";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import Header from "@/components/UI/Header";
import HeaderInfo from "@/components/Shared/HeaderInfo";
import getStaticStrings from "@/data/getStaticStrings.data";
import config from "@/config";
import ExplorerForm from "@/components/PageSrc/Explorer/ExplorerForm";
import { generatePageMetadata } from "@/utils/generateMetadata.util";

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    title: "Diventa Explorer",
    description:
      "Diventa Explorer per inITALY e condividi con il mondo i territori unici, le tradizioni autentiche e le innovazioni che rendono speciale l'Italia. La tua voce può far conoscere luoghi, storie e sapori che meritano di essere scoperti.",
    image: "/statics/website/diventa-explorer/cover.jpg",
    url: `/${locale}/diventa-explorer`,
  });
}

export default async function DiventaExplorerPage({ params }: Props) {
  const { locale } = await params;

  const staticStrings = await getStaticStrings(locale);

  return (
    <>
      <Header staticStrings={staticStrings} bgImage="/statics/website/diventa-explorer/cover.jpg">
        <HeaderInfo title="Diventa Explorer" />
      </Header>
      <div className="container section-padding-top-mobile md:section-padding-top-desktop">
        <div className="grid grid-cols-12 gap-x-column-mobile md:gap-x-column-desktop gap-y-row-mobile md:gap-y-row-desktop">
          <div className="col-span-12">
            <Typography
              variant="h3"
              fontWeight={config.fontWeightTitleDefault}
              fontSize={{ xs: config.fontSizeSubtitleSectioMobile, md: config.fontSizeSubtitleSectionDesktop }}
              className="text-center"
            >
              RACCONTA L&apos;ITALIA AUTENTICA
            </Typography>
          </div>
          <div className="col-span-12">
            <div className="p-6 text-center">
              <p className="font-normal">
                Diventa Explorer per inITALY e condividi con il mondo i territori unici, le tradizioni autentiche e le innovazioni che rendono
                speciale l&apos;Italia. La tua voce può far conoscere luoghi, storie e sapori che meritano di essere scoperti.
              </p>
            </div>
          </div>
          <div className="col-span-12">
            <Image
              src="/statics/website/diventa-explorer/img-totale.png"
              alt="Collage di immagini che rappresentano l'Italia autentica"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
          </div>

          {/* Key Actions Section - ESPLORA, RACCONTA, INFORMA, INDIVIDU */}
          <div className="col-span-12 grid grid-cols-subgrid gap-4">
            <div className="col-span-12">
              <div className="flex flex-col items-center text-center p-6 max-w-md mx-auto">
                <Image src="/statics/website/diventa-explorer/asplora.png" alt="ESPLORA" width={200} height={150} className="w-full h-auto mb-4" />
                <p className="font-normal">Paesaggi, tradizioni, arte e sapori. Condividi e fai conoscere al mondo!</p>
              </div>
            </div>
            <div className="col-span-12">
              <div className="flex flex-col items-center text-center p-6 max-w-md mx-auto">
                <Image src="/statics/website/diventa-explorer/racconta.png" alt="RACCONTA" width={200} height={150} className="w-full h-auto mb-4" />
                <p className="font-normal">Storie, emozioni e immagini. Insieme porteremo nel mondo la bellezza dell&apos;Italia.</p>
              </div>
            </div>
            <div className="col-span-12">
              <div className="flex flex-col items-center text-center p-6 max-w-md mx-auto">
                <Image src="/statics/website/diventa-explorer/informa.png" alt="INFORMA" width={200} height={150} className="w-full h-auto mb-4" />
                <p className="font-normal">La community su ciò che accade. Segnala eventi e bellezze di riferimento del tuo territorio.</p>
              </div>
            </div>
            <div className="col-span-12">
              <div className="flex flex-col items-center text-center p-6 max-w-md mx-auto">
                <Image
                  src="/statics/website/diventa-explorer/individua@2x.png"
                  alt="INDIVIDUA"
                  width={200}
                  height={150}
                  className="w-full h-auto mb-4"
                />
                <p className="font-normal">I potenziali Excellent Crafter. Contribuisci a creare il più grande marketplace d&apos;Italia!</p>
              </div>
            </div>
          </div>

          {/* Chi cerchiamo? Section */}
          <div className="col-span-12 bg-primary-light py-8 px-6 global-border-radius">
            <Typography
              variant="h3"
              fontWeight={config.fontWeightTitleDefault}
              fontSize={{ xs: config.fontSizeSubtitleSectioMobile, md: config.fontSizeSubtitleSectionDesktop }}
              className="text-center mb-6"
            >
              Chi cerchiamo?
            </Typography>
            <div className="max-w-4xl mx-auto space-y-4">
              <p className="font-normal text-center">
                L&apos;Explorer è un punto di riferimento locale, capace di osservare con occhi nuovi e comunicare con entusiasmo.
              </p>
              <p className="font-normal text-center">In questo ruolo avrai la possibilità di:</p>
              <ul className="list-disc list-inside space-y-2 max-w-2xl mx-auto text-left">
                <li className="font-normal">Collaborare con realtà locali e imprese del territorio</li>
                <li className="font-normal">Acquisire competenze in turismo esperienziale, marketing territoriale e comunicazione digitale.</li>
                <li className="font-normal">
                  Crescere personalmente e professionalmente all&apos;interno di una community dinamica e in espansione.
                </li>
              </ul>
              <div className="flex flex-col items-center justify-center mt-8 space-y-2">
                <Image
                  src="/statics/website/diventa-explorer/risorsa-1@2x.png"
                  alt="inITALY logo - Ambasciatori del territorio"
                  width={300}
                  height={100}
                  className="mb-2"
                />
              </div>
            </div>
          </div>
          {/* Fai risplendere la tua terra Section */}
          <div className="col-span-12 py-8 px-6 global-border-radius">
            <div className="max-w-4xl mx-auto space-y-4 text-center">
              <Typography
                variant="h3"
                fontWeight={config.fontWeightTitleDefault}
                fontSize={{ xs: config.fontSizeSubtitleSectioMobile, md: config.fontSizeSubtitleSectionDesktop }}
                className="mb-4"
              >
                Fai risplendere la tua terra.
              </Typography>
              <p className="font-normal">Se ami l&apos;Italia e vuoi contribuire a farla riscoprire al mondo, unisciti a noi.</p>
              <p className="font-normal">Diventa Explorer con inITALY e trasforma la tua passione in un&apos;avventura concreta.</p>
              <p className="font-normal">
                La tua storia comincia qui. <span className="font-bold">Candidati ora.</span>
              </p>
            </div>
          </div>
          <div className="col-span-12">
            <Image
              src="/statics/website/diventa-explorer/man.jpg"
              alt="Explorer - Fai risplendere la tua terra"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
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
          INVIA LA TUA CANDIDATURA PER DIVENTARE EXPLORER
        </Typography>
      </div>
      <div className="container section-padding-top-mobile md:section-padding-top-desktop pb-8">
        <div className="grid grid-cols-12 gap-x-column-mobile md:gap-x-column-desktop gap-y-row-mobile md:gap-y-row-desktop">
          <div className="col-span-12">
            <ExplorerForm staticStrings={staticStrings} locale={locale} />
          </div>
        </div>
      </div>
    </>
  );
}
