---
seo:
  title: Shird
  description: A Flutter Plug and Play Modular Authentification package with multiple Providers and more
---
::u-page-hero
---
orientation: horizontal
---
  :::gif-player
  :::

#title
Flutter Shird

#description
A Flutter Plug and Play Modular Authentification package with multiple Providers and more

  :::prose-pre
  ---
  code: flutter pub add shird
  filename: Terminal
  ---
  ```bash
   flutter pub add shird
  ```
  :::

#links
  :::u-button
  ---
  to: /getting-started/introduction
  size: xl
  trailing-icon: i-lucide-arrow-right
  ---
  Get Started
  :::
#links
  :::u-button
  ---
  to: https://gitlab.xefi.fr/xefi/xefi-interne/flutter_auth_provider
  size: xl
  color: neutral
  target: _blank
  icon:  i-simple-icons-gitlab
  ---
  GitLab
  :::
::

::u-page-section
---
class: "max-w-none px-0"
---
  :::u-page-grid
  ---
  class: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
  ---

    :::u-page-card
    ---
    spotlight: true

    class: "group col-span-1"
    ---
      :::floating-flutter
      :::

    #title
    Build to be [easy]{.text-primary}

    #description
    Built to be truly plug-and-play, this package focuses on [simplicity]{.text-primary} and [effiency]{.text-primary} — no fluff, no bloat. Just drop it in, and it works.
    :::

    :::u-page-card
    ---
    spotlight: true

    class: "group col-span-1"
    ---
      :::floating-flutter
      ---
      image: "/shird_block.png"
      ---
      :::
    #title
    Highly [modular]{.text-primary}

    #description
    Designed to do [more with less]{.text-primary} — start simple, keep it light, and add only the modules you need. A minimal, modular foundation that [grows with your project]{.text-primary}.
    :::

    :::u-page-card
    ---
    spotlight: true

    class: "group col-span-1"
    ---
      :::floating-flutter
      ---
      image: "/shird_chest.png"
      ---
      :::

    #title
    A lot of [Compatibility]{.text-primary}

    #description
    Optimized for seamless integration with your favorite services — [Google]{.text-primary}, [Apple]{.text-primary}, [Microsoft]{.text-primary}, and [more]{.text-primary}. Built for maximum compatibility and effortless setup across ecosystems.
    :::
  :::



  :::u-page-section
  ---
  ui:
    container: sm:py-6 lg:py-7 py-6
  title: First Steps
  id: first-Steps
  ---
  :::

  :::u-page-section
  ---
  ui:
    container: sm:py-6 lg:py-7 py-6
  title: Installation Guide
  orientation: horizontal
  variant: naked
  ---
  #description
  Quick installation setup
    :::prose-pre
    ---
    code: flutter pub add shird
    filename: Terminal
    ---
    ```bash
     flutter pub add shird
    ```
    :::

  #default
    :::prose-pre
    ---
    filename: pubspec.yaml
    ---
    ```yaml
    dependencies:
      flutter:
        sdk: flutter
      shird:
    ```
    :::
  :::
  :::u-page-section
  ---
  ui:
    container: sm:py-6 lg:py-2 py-6
  title: Minimal Setup
  orientation: horizontal
  variant: naked
  reverse: true
  ---
  #description
  Instantiates the minimal email/password setup.
    :::custom-prose-with-bird
    :::
    :::prose-pre
    ---
    filename: login.dart
    ---
    ```typescript
    await shird.login(email: "admin@test.com", password: "123");
    ```
    :::

  #default
    :::prose-pre
    ---
    filename: auth_initialisation.dart
    ---
    ```typescript
    final shird = Shird(
      client: AuthClient(),
      storage: SharedPrefsTokenStorage(),
      loginEndpoint: "http://localhost:3000/auth/login",
      refreshEndpoint: "http://localhost:3000/auth/refresh",
    );
    ```
    :::
  :::


  :::u-page-section
  ---
  ui:
    container: sm:py-6 lg:py-7 py-6
  title: Finally, add a provider
  orientation: horizontal
  variant: naked
  ---
  #description
  Add these lines inside the AuthProvider constructor, then simply call the authWith method.
    :::prose-pre
    ---
    filename: auth_initialisation.dart
    ---
    ```typescript
   microsoft: MicrosoftProvider(
     loginUrl: EnvironmentService.microsoftSsoUrl,
     callbackUrl: EnvironmentService.oauthCallbackUrl,
     navigatorKey: NavigationService.navigatorKey,
   ),
   launchLogin: launchLoginWebview,
    ```
    :::

  #default
    :::prose-pre
    ---
    filename: login.dart
    ---
    ```typescript
    await shird.authWith.microsoft();
    ```
    :::
  :::

  :::u-page-section
  ---
  ui:
    container: sm:py-6 lg:py-7 py-6
  ---
  #links
    :::u-button
    ---
    color: primary
    size: xl
    to: /getting-started/installation
    trailingIcon: i-lucide-arrow-right
    ---
    Get started
    :::
  :::

  ::u-page-section
    :::like-section
    :::

  ::
::
