# To do

## After 5:30 am IST, 26 Nov 2026 (free allowance resets at 00:00 UTC)

Rules for this session:
- Stay on Cloudflare's free allowance. No paid plan, nothing that involves payment.
- Before generating, check "Neurons used today" on the Workers AI page. It should be close to 0.
- Never raise or delete the count in `api/.usage.json`. It resets by itself on the new day and stops at 80 images.
- Budget for items 1 to 4: about 30 images (at most about 3,300 of 10,000 neurons).

1. [ ] **Forehead looks too big: make it slightly smaller** (about 6 images)
   - Cause to check first: the model may be moving the hairline up. Compare the distance from eyebrows to hairline in the original and the preview.
   - Try the prompt first: keep the hairline at the same height as in the photo.
   - Aim for the client's real forehead or very slightly smaller. Don't shrink the face or move the features.
   - Retest buzz cut, quiff, curls and long waves on the same photos.
2. [ ] **Beard gets added or thickened** (about 6 images)
   - Seen on the striped-collar photo: quiff and copper waves.
   - Change the prompt to keep facial hair exactly as in the photo. Naming a fault can invite it, so test the wording.
   - Check that a real beard is still kept (synthetic face 2).
3. [ ] **Smaller image faults** (about 6 images)
   - [ ] Fringe bob looks wig-like, with a blue tint in black
   - [ ] Curls are uneven and flatter on one side (selfie)
   - [ ] "Light brown" looks closer to blonde
   - [ ] Plain white background turns slightly grey
4. [ ] **Recheck all 12 hairstyles once with the final prompts** (12 images)
   - [ ] Run some of them through the app itself, not only the test script

## Any time, no image allowance needed

Use `IMAGE_PROVIDER=mock`.

- [ ] Staff login (needed before previews can go online)
- [ ] Salon accounts, database and job queue
- [ ] "Regenerate" button, because results vary between runs (each use costs one image)
- [ ] Show images left today in the app
- [ ] Collect 5 to 8 more photos of consenting adults: long, curly and coily hair, glasses, older faces, varied skin tones
- [ ] Delete the empty `package-lock.json` in the main folder
- [ ] Delete photos in `quality-test/` when no longer needed

## Before a salon pilot

- [ ] Choose the country and get a privacy check, including Cloudflare's data processing terms
- [ ] Test the camera on a real tablet
- [ ] Merge `backend` into `main` when ready for Vercel

## Decided

- Keep the normal method in the app. Face hiding is not used (3 of 8 hard cases were clean).
- No face blending for quality: 13 of 15 real-photo previews passed, before the forehead feedback.
