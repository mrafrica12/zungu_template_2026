# Ask Zungu — guest journey and future CRM alignment

Discover → Ask → Book → Arrive → Stay → Explore → Request → Checkout → Review

This is a documentation model for a future Guest CRM. No Sheet, CRM, automation or staff helper is created by this phase. The current website prepares enquiries; staff confirm availability, rates and stay arrangements directly in conversation.

## Source of truth

The implemented tag registry and journey mapping live in `assets/js/concierge/concierge-config.js` as `ZUNGU_TAGS` and `ZUNGU_JOURNEY`. The pure `getStageForTag(tag)` helper in `concierge-message.js` returns a stage identifier for an exact registered tag, or `null` for an unknown tag. Every registered tag belongs to exactly one stage; Discover intentionally has no message tag.

Messages retain `[TAG · EN]` or `[TAG · SW]`. Stage names are metadata, never extra lines in guest messages. “Book” is an internal journey label: no website action confirms a booking.

## Stages and responsibility

| Stage | Who acts | Registered tag family or tags |
|---|---|---|
| Discover | Guest browsing the website | None; no page-view tracking enabled by this extension |
| Ask | Guest | WEB-CONCIERGE, WEB-RATES, WEB-ROOMS, WEB-FOOD |
| Book | Guest enquiry; staff verification | WEB-AVAILABILITY, WEB-BOOKING |
| Arrive | Guest and staff | WEB-DIRECTIONS, WEB-TRANSPORT, STAY-MANAGE, STAY-ARRIVAL-CHANGE, STAFF-PREARRIVAL |
| Stay | Guest | GUEST-SERVICE, including during-stay food requests if that service flag is confirmed |
| Explore | Guest | WEB-GUIDE and all registered WEB-GUIDE-* category, help, place and saved-list tags |
| Request | Guest | GUEST-HOUSEKEEPING, GUEST-ASSISTANCE |
| Checkout | Guest | GUEST-CHECKOUT |
| Review | Staff, after an actual stay | POST-STAY-REVIEW |

A tag's existence does not establish that a service is available. Unconfirmed service flags remain false. Pre-arrival and review tags are staff-only registry entries and are rejected by the public guest message builder.

The Explore chooser uses only the existing guide categories and places. Its optional question is included in the WhatsApp text, not in analytics or stored guest records. Guide transport information is not a promise of hotel transport.

## Future CRM statuses — documentation only

| Journey stage | Future CRM status | Proposed staff transition rule |
|---|---|---|
| Ask / Book | New Enquiry → Availability Checked → Awaiting Guest | Staff receive the enquiry, check actual availability and await the guest's response. Opening a website draft alone does not create a confirmed enquiry record. |
| Book | Confirmed | Staff explicitly confirm the arrangement with the guest. Never derive this status from WEB-BOOKING or WEB-AVAILABILITY alone. |
| Arrive | Arriving | Staff verify the expected arrival; the pre-arrival message may be sent the day before. |
| Stay / Explore / Request | Checked In | Staff record the actual check-in. An Explore enquiry can also occur before a stay and must not automatically imply check-in. |
| Checkout | Checked Out | Staff record the actual checkout. A checkout-help request does not prove checkout is complete. |
| Review | Review Requested → Completed | Staff send the same request to every guest who stayed. Completion records the hotel's follow-up workflow; it does not require a positive review or any review at all. |

Stages classify the subject of a message. Statuses describe a verified operational state. Neither should automatically overwrite the other: a confirmed guest may still ask about rates, and someone browsing may explore the guide without arranging a stay.

## Staff messages

Use [the staff templates](staff-message-templates.md). Staff send the pre-arrival message themselves the day before a verified arrival. After checkout, every guest who actually stayed receives the same review invitation with the same link, without satisfaction screening or incentives. Private replies remain an additional option.

The Google Business Profile review link remains a confirmation item in the template document. Until supplied, the review draft must not be sent. All Kiswahili staff templates remain marked for native-speaker verification.

## Privacy and analytics state

Logging is disabled. There is no concierge logging module, Apps Script endpoint or CRM integration. This phase creates documentation only and does not collect guest information.

If analytics are separately authorized later, stage may accompany approved non-personal metadata. Never include names, telephone numbers, dates, room numbers or free-text questions. The add-on's four-field privacy rule and its longer sample Sheet header need reconciliation before logging is implemented; this document does not authorize either payload.

The optional staff helper requires a separate explicit go-ahead. It would prepare drafts only, store no names or numbers, and never send automatically. A noindex page is not access control and must contain no guest database or secrets.

## Client handover paragraph

Ask Zungu guides guests from discovering the hotel through enquiries, arrival, their stay, exploring Goba, requests and checkout. Each WhatsApp enquiry carries a consistent reference tag so staff can understand its purpose; the website never confirms availability, rates or a stay. Staff send pre-arrival messages themselves the day before a verified arrival and review requests after checkout. Every guest who actually stayed is asked for a review in the same way, with the same link and no incentives or satisfaction screening. Kiswahili templates need native-speaker approval, and the hotel must provide its review link before review requests are used. The future CRM statuses are documented only; no CRM or automatic messaging is active.
