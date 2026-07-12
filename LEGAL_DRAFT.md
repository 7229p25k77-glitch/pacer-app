# Pacer — Safety & Legal Draft (NOT lawyer-reviewed)

> ⚠️ **This is NOT legal advice and was not written by a lawyer.** It is a plain-English
> *template / placeholder* to hand to a qualified attorney in your jurisdiction before Pacer
> is distributed publicly (App Store, or the public githack link if strangers use it).
> Liability/waiver language varies by country and state; some clauses (e.g. waiving gross
> negligence or non-waivable consumer rights) are **unenforceable no matter what they say**;
> and health-related data can trigger separate privacy obligations. Fill in every `[BRACKET]`.

This is a **standalone reference file only — none of this is wired into the app.** It's kept
here so the wording exists when you're ready (and lawyer-reviewed) to add it.

---

## A. Draft in-app first-run acknowledgment (the modal copy — NOT currently in the app)

Proposed copy for a future one-time "I understand" safety modal. Not implemented in
`runna-app.html`.

**Title:**
> Before you start — a note on safety

**Body:**
> Pacer is a personal training companion, **not a medical service**, and it isn't made by
> doctors or physiotherapists. Running and exercise carry an inherent risk of injury. You're
> taking part voluntarily and **at your own risk**. Check with a doctor before starting a new
> training plan — especially if you have any health condition, injury, pain, or you're new to
> exercise — and stop and seek help if something hurts.

**Button:** `I understand`

---

## B. Full "Terms of Use & Health Disclaimer" skeleton (for a Terms of Service page)

*Last updated: [DATE]. Provided by [YOUR NAME / ENTITY], "we"/"us". Questions: [CONTACT EMAIL].*

**1. What Pacer is (and isn't).** Pacer is a general fitness and running-coaching app for
everyday runners. It is **not medical advice** and is **not created, reviewed, or endorsed by
licensed medical, physiotherapy, or other healthcare professionals**. Any training plans, pace
targets, injury information, or readiness suggestions are general, informational content based
on commonly accepted, research-informed methods — not a diagnosis, treatment, or professional
recommendation for you specifically.

**2. Consult a professional.** Before beginning or changing any exercise program, consult a
physician or qualified healthcare provider — especially if you have or may have a medical
condition, are injured, are pregnant, are new to exercise, or experience pain, dizziness, chest
discomfort, or shortness of breath. If you think you have a medical emergency, contact your
local emergency services immediately.

**3. Assumption of risk.** You understand that running and physical exercise involve inherent
risks, including but not limited to muscle strains, joint and bone injuries, cardiovascular
events, and in rare cases serious injury or death. You voluntarily choose to use Pacer and to
undertake any activity it suggests, and you knowingly and freely **assume all such risks**. You
are solely responsible for exercising within your own limits and stopping when your body tells
you to.

**4. "As-is", no warranty.** Pacer is provided "as is" and "as available", without warranties of
any kind, express or implied, including fitness for a particular purpose or that the app, its
content, distance/pace tracking, or GPS data are accurate, complete, or uninterrupted.

**5. Limitation of liability.** To the fullest extent permitted by applicable law,
[YOUR NAME / ENTITY] and its contributors are not liable for any injury, loss, or damages of any
kind arising out of or related to your use of Pacer or your participation in any activity it
suggests. **Nothing in these terms excludes or limits liability that cannot be excluded or
limited under applicable law** (for example, for death or personal injury caused by our
negligence where the law does not allow it to be excluded, or your non-waivable consumer rights).

**6. Your responsibility for your data.** Pacer stores your training and check-in data on your
device. You are responsible for the information you enter. *[If you ever add accounts/cloud/
sharing, this needs a real Privacy Policy — health-related data is often specially regulated.]*

**7. Suitability & younger users.** Pacer is intended for general adult use. If used by a minor,
it should be with the guidance and supervision of a parent, guardian, or coach. *[Confirm age
policy with your lawyer, especially for app-store age ratings.]*

**8. Changes & contact.** We may update these terms; continued use means you accept the current
version. Questions: [CONTACT EMAIL].

**By using Pacer, you acknowledge that you have read and understood this disclaimer and agree
to it.**

---

## Notes for when you take this to a lawyer / prepare for release
- **Clause 5 is deliberately hedged** ("to the fullest extent permitted… nothing excludes what
  can't be excluded"). That carve-out is what stops a limitation clause being thrown out wholesale
  where blanket waivers aren't allowed — don't delete it to make it sound "stronger."
- **The App Store requires BOTH** a Terms of Use *and* a Privacy Policy at a reachable URL. This
  file covers the health/liability half, not privacy.
- **Keep the tone split:** the short Section A line stays friendly and in-app; Section B belongs
  on a linked "Terms & Safety" page, not as a wall of legalese in the main UI.
- **Existing in-app disclaimer:** the Health tab already carries a "not medical advice / not from
  licensed professionals" note (see `renderInjurySection` in `runna-app.html`) — keep it.
