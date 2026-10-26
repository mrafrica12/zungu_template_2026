# Ask Zungu — staff message templates

These messages are sent manually by Zungu Hotel staff. The website does not send them or confirm a stay. Use the guest's existing WhatsApp conversation, replace placeholders, review the message and tap Send yourself. Do not paste guest details into this document or commit completed messages to the website repository.

The stage is internal metadata. Keep the final reference line in the message, using `[TAG · EN]` or `[TAG · SW]`; do not add the stage to the message.

## Pre-arrival

**Stage:** Arrive · **Tag:** `STAFF-PREARRIVAL`

Send the day before the guest's expected arrival, after staff have confirmed the stay and checked the arrival date directly. Do not send this welcome to an unconfirmed enquiry. “Tomorrow” must match the actual arrival date.

### English

```text
Karibu {name} 👋
We're looking forward to welcoming you to Zungu Hotel tomorrow.

Directions: https://maps.app.goo.gl/AhsCizjzyFCqkFHN9
Need help before you arrive? Just reply to this message.

Zungu Hotel, Goba
[STAFF-PREARRIVAL · EN]
```

### Kiswahili — draft

<!-- VERIFY: native Kiswahili review of the entire pre-arrival template before staff use. -->

```text
Karibu {name} 👋
Tunatarajia kukukaribisha Zungu Hotel kesho.

Maelekezo: https://maps.app.goo.gl/AhsCizjzyFCqkFHN9
Unahitaji msaada kabla ya kuwasili? Jibu ujumbe huu.

Zungu Hotel, Goba
[STAFF-PREARRIVAL · SW]
```

## Post-stay review

**Every guest who actually stayed receives the same review request after checkout, with the same review link, regardless of whether their feedback was positive or negative.** Do not ask about satisfaction first to decide who receives the link. The invitation to reply privately is an additional option, never a filter or a replacement for the review link. Do not offer gifts, discounts or other incentives for reviews.

**Stage:** Review · **Tag:** `POST-STAY-REVIEW`

<!-- CONFIRM: Google Business Profile review link. Replace {GOOGLE_REVIEW_LINK} only with the hotel-confirmed direct review URL. -->

The review link is not configured. Keep `{GOOGLE_REVIEW_LINK}` in this master template until the hotel supplies it; do not send guests a message containing the placeholder. Do not substitute the directions link or invent a review URL. The public website must not display or send this review request.

### English

```text
Thank you for staying with us at Zungu Hotel, {name} ❤️
We hope you enjoyed your stay.

If you have a moment, we'd really appreciate a review:
{GOOGLE_REVIEW_LINK}

If anything wasn't right, you can also reply here to let us know.

Zungu Hotel, Goba
[POST-STAY-REVIEW · EN]
```

The reply invitation avoids promising a particular remedy or outcome.

### Kiswahili — draft

<!-- VERIFY: native Kiswahili review of the entire post-stay review template before staff use. -->

```text
Asante kwa kukaa nasi Zungu Hotel, {name} ❤️
Tunatumaini ulifurahia ukaaji wako.

Ukipata muda, tutashukuru ukituandikia maoni:
{GOOGLE_REVIEW_LINK}

Ikiwa kuna jambo ambalo halikuwa sawa, unaweza pia kujibu hapa kutujulisha.

Zungu Hotel, Goba
[POST-STAY-REVIEW · SW]
```

## Staff workflow

1. Check the guest's actual arrival or completed stay in the hotel's own records. A website enquiry tag is not confirmation of a stay.
2. Select the appropriate template and language. Kiswahili copy needs native-speaker review before use; the website's language toggle does not establish which languages staff speak.
3. Replace `{name}` and, for reviews, the confirmed review link. Check the recipient and dates.
4. Review the complete draft in WhatsApp, then send manually. Never send unresolved placeholders.
5. In any future CRM, record a message as sent only after staff have sent it. Preparing or opening a draft is not proof of sending.

The optional staff helper page is not built in this phase. See [Guest journey and future CRM alignment](guest-journey.md) for the future status model.
