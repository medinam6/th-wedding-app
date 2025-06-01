import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

export const Faq = () => {
  return (
    <Card className="mb-8 bg-white text-black">
      <CardHeader>
        <CardTitle className="text-3xl font-serif text-center text-black">
          Frequently Asked Questions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="rsvp-date">
            <AccordionTrigger className="text-black hover:text-black text-left">
              What date should I RSVP by?
            </AccordionTrigger>
            <AccordionContent>
              <p>Please RSVP by 03/09/2026</p>
              <p className="mt-2">
                This ensures we can finalize our arrangements and reserve a spot for you to
                celebrate with us!
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="venue">
            <AccordionTrigger className="text-black hover:text-black text-left">
              What is the address of the wedding ceremony and reception venue?
            </AccordionTrigger>
            <AccordionContent>
              <p>JW Marriott (attached to the Rampart Casino)</p>
              <p>221 N Rampart Blvd, Las Vegas, NV 89145</p>
              <p className="mt-2">
                Ceremony and reception to be held at the same venue. No relocating.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="parking">
            <AccordionTrigger className="text-black hover:text-black text-left">
              Is there parking?
            </AccordionTrigger>
            <AccordionContent>
              <p>Complimentary Valet is available and is the closest to the ceremony site</p>
              <p>Complimentary self-parking garage is toward the back of the Rampart Hotel</p>
              <p>Once you arrive, you&apos;ll see signage directing you to the ceremony.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="arrival-time">
            <AccordionTrigger className="text-black hover:text-black text-left">
              What time should I arrive at the ceremony?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                Please plan to arrive no later than 4:00 pm before the ceremony begins to allow for
                seating and getting settled. We also recommend considering traffic and travel time
                to ensure you don&apos;t miss any part of the celebration! We look forward to seeing
                you there!
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="hotel-blocks">
            <AccordionTrigger className="text-black hover:text-black text-left">
              Have you reserved blocks of rooms at the hotel?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                We have not reserved any room blocks, but you&apos;re welcome to book a room at the
                wedding venue or nearby hotels. Here are a few great options:
              </p>
              <br />
              <p>
                <a
                  href="https://www.marriott.com/en-us/hotels/lasjw-jw-marriott-las-vegas-the-resort-at-summerlin/rooms/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  JW Marriott Las Vegas Resort & Spa
                </a>
                : This is where the wedding will be held! It&apos;s a beautiful resort with lush
                gardens, a spa, and easy access to everything on the big day.
              </p>
              <p>
                <a
                  href="https://www.redrockresort.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Red Rock Casino Resort & Spa
                </a>
                : A luxury resort nestled near the Red Rock Canyon, offering fantastic dining and
                desert views.
              </p>
              <p>
                <a
                  href="https://suncoast.boydgaming.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Suncoast Hotel & Casino
                </a>
                : A comfortable and convenient option with dining, gaming, and shopping nearby.
              </p>
              <br />
              <p>We recommend booking early to get the best rates and availability.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="dress-code">
            <AccordionTrigger className="text-black hover:text-black text-left">
              What is the dress code for your wedding?
            </AccordionTrigger>
            <AccordionContent>
              <p>Evening Formal attire.</p>
              <p className="mt-2">For women:</p>
              <ul className="list-disc ml-6">
                <li>Tea, ankle, or floor-length dresses.</li>
                <li>Fancier floor-length jumpsuit.</li>
                <li>Minimize cut outs, slits, and plunging necklines.</li>
              </ul>
              <p className="mt-2">For men:</p>
              <ul className="list-disc ml-6">
                <li>Matching suit, tie not required.</li>
              </ul>
              <p className="mt-2">
                We kindly request no sneakers, jeans, or shorts—come dressed to impress!
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="colors">
            <AccordionTrigger className="text-black hover:text-black text-left">
              Are there any colors I should avoid wearing?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                We kindly ask the ladies to refrain from wearing white, ivory, champagne, or
                cream-colored attire.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="examples_women">
            <AccordionTrigger className="text-black hover:text-black text-left">
              Dresscode Examples for Women
            </AccordionTrigger>
            <AccordionContent>
              <Image src="/black_tie_examples.jpg" alt="casual dresses" width={500} height={300} />
              <Image src="/formal_dresses.jpg" alt="casual dresses" width={500} height={300} />
              <Image src="/casual_dresses.jpg" alt="casual dresses" width={500} height={300} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="examples_men">
            <AccordionTrigger className="text-black hover:text-black text-left">
              Dresscode Examples for Men
            </AccordionTrigger>
            <AccordionContent>
              <Image src="/men_examples.jpg" alt="men examples" width={500} height={300} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="photos">
            <AccordionTrigger className="text-black hover:text-black text-left">
              Am I allowed to take photos during the ceremony?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                We kindly ask that you keep our wedding &quot;unplugged&quot; and refrain from
                taking any photos or videos during the ceremony. We want our guests to be truly in
                the moment with us during this special day.
              </p>
              <p className="mt-2">
                Please avoid blocking the view of our professional photographers who will be
                capturing every moment. Once we are announced as husband and wife, feel free to take
                as many pictures and videos as you&apos;d like.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="plus-one">
            <AccordionTrigger className="text-black hover:text-black text-left">
              Can I bring a plus one?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                To keep our wedding intimate, we ask that only those named in your invitation
                attend. Thank you for understanding—we can&apos;t wait to celebrate with you!
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="bar">
            <AccordionTrigger className="text-black hover:text-black text-left">
              Will there be an open bar?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                There will be an open bar for guests to enjoy throughout cocktail hour and the
                reception. We do recommend bringing cash along for tips.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="gifts">
            <AccordionTrigger className="text-black hover:text-black text-left">
              Where should we bring/send our wedding gift?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                Your presence is the best gift, but if you&apos;d like to give something, we kindly
                accept contributions via cash or Zelle at hntfinallyeverafter@gmail.com. Thank you!
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="food">
            <AccordionTrigger className="text-black hover:text-black text-left">
              What type of food will be served at the wedding?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                We&apos;ll serve hors d&apos;oeuvres at cocktail hour, followed by a sit-down dinner
                with a choice of entrees. There will be a meat, fish, and vegetarian option
                available.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="location">
            <AccordionTrigger className="text-black hover:text-black text-left">
              Is the wedding indoors or outdoors?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                Our wedding will be held outdoors. The ceremony and reception will take place on the
                lawn, while cocktail hour will be on firm ground.
              </p>
              <p className="mt-2">
                We recommend something like this to keep you from sinking into the grass.
              </p>
              <a
                href="https://a.co/d/8BjRWgS"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View recommended footwear
              </a>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="airport">
            <AccordionTrigger className="text-black hover:text-black text-left">
              What&apos;s the best airport to use?
            </AccordionTrigger>
            <AccordionContent>
              <p>Harry Reid</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="children">
            <AccordionTrigger className="text-black hover:text-black text-left">
              Are children allowed?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                Although we adore your children, we&apos;ve elected to limit our ceremony and
                reception to adults only
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="social-media">
            <AccordionTrigger className="text-black hover:text-black text-left">
              Is it ok to post wedding photos on social media?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                Yes, feel free to share! Just please hold off during the ceremony. Don&apos;t forget
                to use our hashtag [#HenryHeartsTeresa] so we can see your lovely pics.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="online-rsvp">
            <AccordionTrigger className="text-black hover:text-black text-left">
              Can I RSVP online?
            </AccordionTrigger>
            <AccordionContent>
              <p>We invite you to RSVP here on this website!</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
export default Faq
