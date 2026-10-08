<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application rules
- Keep the fictional company experience at the index route, with in-page navigation for its sections, so the game remains uninterrupted.
- Use a browser-loaded Matter.js engine for the viewport doodle movement, keeping physics out of server rendering.
- Keep game controls and state in the Playground component and pure movement helpers in the game module, so the company content stays independent.
- Define visual roles in the shared CSS design system and use the shared Button for interactive controls, so website and game controls stay consistent.
