# Zungu Hotel — luxury website design prompt

Prepared 25 October 2026. Saved for future use; no website changes are part of this prompt-writing task.

## Copy-ready prompt

Act as a senior hospitality website designer and front-end developer. Design a refined, responsive website for **Zungu Hotel, Goba**, in Dar es Salaam, Tanzania.

Use [1 Hotel South Beach](https://www.1hotels.com/south-beach) as the primary visual reference. Draw inspiration from its immersive photographic opening, restrained navigation, warm off-white surfaces, earthy colours, widely spaced uppercase headings, generous whitespace and editorial accommodation presentation. Create an original Zungu identity using these principles. Do not reuse 1 Hotels branding, copy, images or property claims.

Make the experience feel calm and luxurious through composition, typography and authentic photography. The main goal is to help visitors discover the actual hotel and enquire directly on WhatsApp.

### Project context

Read the existing research before designing:
- `research/01-business-information.md`
- `research/03-website-content-brief.md`
- `research/04-owner-checklist.md`
- `research/05-media-inventory.md`
- `research/media-manifest.json`

Inspect any existing website implementation and preserve working functionality while applying the requested visual direction. Treat missing facts as internal content tasks, not invented public copy.

### Confirmed hotel details

- **Name:** Zungu Hotel, Goba.
- **Address:** Goba, near Ndambi Bus Stop, Dar es Salaam, Tanzania.
- **Telephone and confirmed WhatsApp:** +255 766 003 050.
- **Call:** `tel:+255766003050`.
- **WhatsApp:** https://wa.me/255766003050
- **Directions:** https://maps.app.goo.gl/AhsCizjzyFCqkFHN9
- **Instagram:** https://www.instagram.com/zungu.hotel/
- **Map coordinates:** -6.7383321, 39.1907418.

### Visual direction

Use this proposed Zungu palette; these are recommendations, not exact colours extracted from the reference:

| Role | Colour |
|---|---|
| Main background | Warm ivory #F3F1E9 |
| Secondary background | Soft sand #DED6C8 |
| Main text | Charcoal #292D27 |
| Buttons and accents | Muted olive #495143 |
| Optional brand detail | Deep teal #174B4B |

Use a refined light-to-regular sans-serif with an editorial character. Give short uppercase headings modest letter spacing. Keep paragraphs in sentence case, comfortably readable, with clear hierarchy.

Use approximately 96–128px section spacing on desktop and 48–72px on mobile. Combine wide images, portrait photographs and concise text in varied arrangements. Prefer square or minimally rounded corners, fine rules and understated buttons. Avoid excessive cards, heavy shadows, glossy gold effects and decorative badges.

### Homepage structure

1. **Discreet header.** Place the menu at the left, the Zungu Hotel name or approved logo centrally, and “Enquire about a stay” at the right. Maintain contrast over photography and switch to an ivory header on scroll. Navigation: Home, Stay, Gallery, Find Us, Contact. Add Food & Drinks only when current service details are approved.

2. **Photographic opening.** Use actual Zungu imagery. Heading: “Zungu Hotel”. Location: “Goba · Dar es Salaam”. Supporting copy: “Find us near Ndambi Bus Stop. Contact our team to plan your stay.” Actions: “Enquire on WhatsApp” and “Explore the hotel”. If the available photograph cannot support a sharp full-width hero, choose a framed or split-image composition rather than stretching it.

3. **Welcome.** A short introduction in generous whitespace. Establish the location and invite guests to contact the hotel. Write with warmth and confidence, avoiding unsupported superlatives.

4. **Stay.** Present actual bedroom photographs in a spacious editorial section titled “Your stay at Zungu”. Invite guests to ask about room options and availability. Do not invent room categories, prices, capacities, bed sizes or amenities.

5. **Details of the hotel.** Add exterior and interior imagery with short, accurate captions. Drinks images may appear as gallery subjects. A dedicated dining/bar offer requires confirmed current information. Do not imply breakfast, wine or other extras are included.

6. **Gallery.** Curate the strongest photographs in varied proportions with an accessible lightbox. Use fewer strong images instead of displaying every asset. Keep colours natural.

7. **Find us.** Show the address, telephone, WhatsApp and a clear Google Maps directions link. An embedded map is optional; never use an invented location illustration as a factual map.

8. **Closing invitation.** “Plan your stay in Goba”, followed by WhatsApp and call actions. Finish with a minimal footer containing address, Instagram and navigation. Only link to policies that actually exist.

### Real assets and image selection

Use local assets and consult the manifest for dimensions and publication status.

Within `assets/images/gallery/`:
- `zungu-hotel-google-01.jpg`: wide exterior, 1200 × 811; useful for an introduction at an appropriate display size.
- `zungu-hotel-google-05.jpg`: clean bedroom view, 1080 × 1080; suitable for a room feature.
- `zungu-hotel-google-02.jpg`: larger bedroom image, with darker lighting.
- `zungu-hotel-google-06.jpg`: landscape exterior detail.
- `zungu-hotel-google-07.jpg`: bar bottle display.
- `zungu-hotel-google-08.jpg`: drink being poured.
- `zungu-hotel-google-09.jpg`: high-resolution portrait exterior.
- `zungu-hotel-google-10.jpg`: high-resolution wine still life.

Keep the third-party image in `assets/images/reference/` out of production unless permission is confirmed. Verify reuse rights and whether dated photos still represent the property before publishing.

The 150px avatar in `assets/images/logo/` is reference-only and reads “ZUNGU BUSINESS”. Until an approved hotel logo is supplied, use a tasteful text treatment reading “Zungu Hotel”. Do not enlarge the avatar or invent an emblem.

No original video files were downloaded during research. Begin with still photography. Add a video hero only if suitable original hotel footage is supplied. Never substitute imagery of another hotel's beach, pool, rooms or spa.

### Enquiry experience

The conversion goal is a direct enquiry, not an automatically confirmed reservation.

Use this prefilled link for the main WhatsApp action:

https://wa.me/255766003050?text=Hello%20Zungu%20Hotel%2C%20I%20would%20like%20to%20enquire%20about%20room%20availability.

Opening WhatsApp must not automatically send a message. If dates and guest inputs are included, label the action “Enquire on WhatsApp” and state that the hotel confirms availability and rates. Do not simulate booking confirmation, live availability or payment collection.

On mobile, provide a compact WhatsApp/Call contact bar that respects safe areas and does not cover content.

### Content boundaries

“Luxury” describes the visual direction, not a verified hotel classification. Do not claim five-star status, awards, beachfront access, pools, spa facilities, sustainability credentials, free Wi-Fi or breakfast without supporting hotel information. Do not create fictional testimonials, menus or offers.

Keep content gaps in a separate handoff note rather than showing technical explanations or internal verification labels to guests.

### Motion, accessibility and performance

Use gentle fades and restrained image transitions. Respect reduced-motion preferences. Avoid scroll hijacking and aggressive parallax.

Make navigation and galleries keyboard-accessible with visible focus indicators, labelled controls, meaningful image descriptions and strong text contrast. Use responsive image derivatives while retaining originals. Lazy-load below-the-fold imagery and prioritise the opening image. Prevent layout shifts.

Verify the design at 375px, 768px and 1440px: no horizontal overflow, clipped headings, obstructed contact controls or unreadable text.

### Completion criteria for the future build

Deliver a cohesive, polished local website with a clear photographic opening, confident typography, generous spacing and working contact links. Use supported facts and authentic Zungu images throughout. Summarise remaining content requirements separately. Do not publish or deploy unless explicitly requested.
