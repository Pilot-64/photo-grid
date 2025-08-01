/// <reference types="vite/client" />
import {
  Badge,
  Box,
  Button,
  Card,
  Code,
  Container,
  Flex,
  Grid,
  Inline,
  Stack,
  studioTheme,
  Text,
  ThemeProvider,
  ToastProvider,
  useToast,
} from "@sanity/ui";
import { LaunchIcon, ErrorOutlineIcon } from "@sanity/icons";
import { app } from "../../../../../photo-grid.json";

export default () => {
  const webhookUrl = import.meta.env.SANITY_STUDIO_HOST_WEBHOOK_URL;
  const webhookMethod =
    import.meta.env.SANITY_STUDIO_HOST_WEBHOOK_METHOD || "POST";
  const coolifyApiToken = import.meta.env.COOLIFY_API_TOKEN;

  const toast = useToast();

  const triggerWebhook = async () => {
    if (!webhookUrl || !coolifyApiToken) {
      toast.push({
        status: "error",
        title: "Missing configuration",
        description:
          "Webhook URL or API token not set. Check environment variables.",
      });
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: webhookMethod,
        headers: {
          Authorization: `Bearer ${coolifyApiToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      toast.push({
        status: "success",
        title: "Triggered Webhook",
        description: "Please allow a few minutes for the build and deployment.",
      });
    } catch (error) {
      toast.push({
        status: "error",
        title: "Webhook Trigger Failed",
        description: String(error),
      });
    }
  };

  const renderNoWebhook = () => {
    return (
      <ThemeProvider theme={studioTheme}>
        <ToastProvider>
          <Container width={2}>
            <Card
              padding={[3, 4, 5]}
              paddingBottom={[4, 5, 6]}
              marginX={4}
              marginY={6}
              radius={1}
              shadow={2}
              tone="caution"
              style={{ textAlign: "center" }}
            >
              <Box
                marginBottom={2}
                style={{ fontSize: 32, color: "var(--card-muted-fg-color)" }}
              >
                {(ErrorOutlineIcon as any).render()}
              </Box>
              <Text size={2} muted>
                Oops! We couldn't find a valid webhook URL. Please see{" "}
                <a
                  href="https://github.com/kwickramasekara/photo-grid/wiki/Customizations#environment-variables"
                  target="_blank"
                >
                  documentation {(LaunchIcon as any).render()}.
                </a>
              </Text>
            </Card>
          </Container>
        </ToastProvider>
      </ThemeProvider>
    );
  };

  const render = () => {
    return (
      <ThemeProvider theme={studioTheme}>
        <ToastProvider>
          <Container display="grid" width={6}>
            <Card shadow={2} radius={1} padding={4} marginX={4} marginY={6}>
              <Grid columns={[1, 1, 8, 12]} gap={4}>
                <Box
                  column={[1, 1, 6, 10]}
                  overflow="hidden"
                  style={{ paddingBottom: 10 }}
                >
                  <Stack space={3}>
                    <Inline space={2}>
                      <Text weight="bold" size={3}>
                        {new URL(app.domain).host}
                      </Text>
                      <a
                        href={`${app.domain}/${app.basePathName}`}
                        target="_blank"
                      >
                        <Button
                          mode="ghost"
                          tone="primary"
                          fontSize={1}
                          text="Open"
                          padding={2}
                          iconRight={LaunchIcon}
                          space={2}
                        />
                      </a>
                    </Inline>

                    <Inline space={2} style={{ display: "flex" }}>
                      <Text size={1} weight="semibold">
                        Webhook:
                      </Text>
                      <Badge
                        fontSize={1}
                        mode="outline"
                        style={{ marginTop: -3 }}
                      >
                        {webhookMethod}
                      </Badge>
                      <Code size={1} muted>
                        {webhookUrl ? webhookUrl : "N/A"}
                      </Code>
                    </Inline>
                  </Stack>
                </Box>
                <Box column={[1, 1, 2, 2]} style={{ paddingBottom: 10 }}>
                  <Flex
                    direction="column"
                    style={{ height: "100%" }}
                    align={["stretch", "stretch", "flex-end", "flex-end"]}
                    justify="flex-end"
                  >
                    <Button
                      fontSize={5}
                      text="Publish"
                      mode="default"
                      tone="primary"
                      paddingX={4}
                      onClick={() => triggerWebhook()}
                    />
                  </Flex>
                </Box>
              </Grid>
            </Card>
          </Container>
        </ToastProvider>
      </ThemeProvider>
    );
  };

  return webhookUrl ? render() : renderNoWebhook();
};
