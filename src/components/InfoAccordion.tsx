import { ExternalLinkIcon } from "./ExternalLinkIcon";

const InfoAccordion = () => {
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const textarea = e.currentTarget.querySelector(
      "#issue",
    ) as HTMLTextAreaElement;
    const issue = formData.get("issue");
    try {
      const response = await fetch("/api/gifts/report-error", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ issue: issue }),
      });
      // clear textarea value
      textarea.value = "";
      if (response.ok) {
        alert("Error report sent!");
      } else {
        alert("Issue delivering error report. Try again later");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="mt-10">
      <div className="collapse collapse-arrow bg-base-200 border border-black/15 dark:border-stone-600 rounded-lg mb-4">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title text-lg font-semibold">Sizing Info</div>
        <div className="collapse-content">
          <dl className="divide-y divide-black/15 dark:divide-stone-600">
            <div className="flex justify-between py-2">
              <dt className="font-medium">Shirt</dt>
              <dd>Medium</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="font-medium">Shorts</dt>
              <dd>Medium (7 inch length preferred)</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="font-medium">Sweatshirt</dt>
              <dd>Large</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="font-medium">Pants</dt>
              <dd>32x34</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="font-medium">Shoes</dt>
              <dd>13M US</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="collapse collapse-arrow bg-base-200 border border-black/15 dark:border-stone-600 rounded-lg mb-4">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title text-lg font-semibold">
          Things I Always Need
        </div>
        <div className="collapse-content">
          <dl className="divide-y divide-black/15 dark:divide-stone-600">
            {[
              {
                name: "Whey Protein",
                desc: "Dymatize Elite Whey Protein Chocolate (5 lb)",
                link: "https://www.amazon.com/gp/product/B00CUDYY2U/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1",
              },
              {
                name: "Casein Protein",
                desc: "Dymatize Elite Casein Protein Chocolate (4 lb)",
                link: "https://www.amazon.com/gp/product/B007L4QMGO/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&th=1",
              },
              {
                name: "Creatine",
                desc: "CON-CRET Creatine HCl Capsules (90 ct)",
                link: "https://www.amazon.com/gp/product/B0BKCVLYGX/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1",
              },
              {
                name: "Daily Sunscreen",
                desc: "elta MD UV Clear Broad Spectrum SPF 46",
                link: "https://eltamd.com/products/uv-clear-broad-spectrum-spf-46?variant=43130780811417&country=US&currency=USD&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&srsltid=AfmBOopd7L2Rex9kaKVhgZ_yX1q8qMKU2XpUm9i1IvziPGkJLRwL9HBshMU",
              },
              {
                name: "Retinol Serum",
                desc: "The Inkey List Retinol Serum",
                link: "https://www.sephora.com/product/retinol-serum-P443842",
              },
              {
                name: "Hyaluronic Acid Serum",
                desc: "The Inkey List Hyaluronic Acid Serum",
                link: "https://www.sephora.com/product/hyaluronic-acid-hydrating-face-serum-P443845?country_switch=us&lang=en&skuId=2211464&om_mmc=ppc-GG_17798154149___2211464__9008163_c&country_switch=us&lang=en&gad_source=1&gclid=CjwKCAiA65m7BhAwEiwAAgu4JH0lY7uFGSfVpNscylqUrKXFcUS6D15V6QnrW-1-ajKPLFRZ0R2u4hoCBNEQAvD_BwE&gclsrc=aw.ds",
              },
              {
                name: "Vitamin C and EGF Serum",
                desc: "The Inkey 15% Vitamin C and EGF Serum",
                link: "https://www.sephora.com/product/the-inkey-list-15-vitamin-c-egf-brightening-serum-P455368",
              },
              {
                name: "Caffeine Eye Cream",
                desc: "The Inkey Caffeine Eye Cream",
                link: "https://www.theinkeylist.com/products/caffeine-eye-cream",
              },
              {
                name: "Peptide Moisturizer",
                desc: "The Inkey Peptide Moisturizer",
                link: "https://www.theinkeylist.com/products/peptide-moisturizer?currency=USD&variant=35432169046179&utm_source=google&utm_medium=cpc&utm_campaign=Google%20Shopping&stkn=63717ce8f004&utm_source=google&utm_medium=cpc&tw_source=google&tw_adid=722273168782&tw_campaign=21930180377&gad_source=1&gclid=CjwKCAiAzPy8BhBoEiwAbnM9O7iWAVB8egpekVnzdXVYuFHplrtiu3fvj6ur3oaTR-XWbhqGCok6SRoCwRwQAvD_BwE",
              },
              {
                name: "Facial Cleanser",
                desc: "Anthony's Glycolic Facial Cleanser",
                link: "https://anthony.com/collections/cleanse-face/products/glycolic-facial-cleanser?gad_source=1&gclid=CjwKCAiAjp-7BhBZEiwAmh9rBXEUIRiX5ODEnaOd7CUj4lrbVhr8ck9H4z6LyfpwJ9rSQ-XZ3qcwchoCLlAQAvD_BwE",
              },
            ].map((item) => (
              <div key={item.name} className="py-3">
                <dt className="font-medium">{item.name}</dt>
                <dd className="flex items-center justify-between mt-1">
                  <p className="text-sm">{item.desc}</p>
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLinkIcon />
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="collapse collapse-arrow bg-base-200 border border-black/15 dark:border-stone-600 rounded-lg mb-4">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title text-lg font-semibold">
          Something Broken? Let Me Know!
        </div>
        <div className="collapse-content">
          <form
            action="/api/gifts/report-error"
            method="POST"
            onSubmit={submitHandler}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="issue"
                className="block text-sm font-medium text-stone-700 dark:text-stone-300"
              >
                Describe your issue
              </label>
              <textarea
                name="issue"
                id="issue"
                className="mt-2 w-full border border-black/15 dark:border-stone-600 rounded-lg dark:bg-stone-700 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                rows={5}
                maxLength={255}
                required
                placeholder="Include as much detail as you can..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 py-2 px-4 rounded-lg bg-black/80 text-white dark:bg-white dark:text-black hover:bg-black dark:hover:bg-stone-300 transition-colors duration-200 ease-in-out"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InfoAccordion;
