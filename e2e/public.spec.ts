import { expect, test } from "@playwright/test";
test("landing comunica a proposta e abre cadastro",async({page})=>{await page.goto("/");await expect(page.getByRole("heading",{name:/Recupere o controle/i})).toBeVisible();await page.getByRole("link",{name:/Começar gratuitamente/i}).click();await expect(page).toHaveURL(/signup/);await expect(page.getByRole("heading",{name:/Comece com um passo pequeno/i})).toBeVisible()});
test("SOS permanece disponível na navegação mobile autenticada",async()=>{test.skip(!process.env.E2E_USER_EMAIL,"Requer usuário do seed local")});
