/* NOTE: This is a work in progress. */

export class OpenTableActions {
    constructor(private page: any) {}

    // fix the logic in this function
    async selectDate(date: string) {
        await this.page.getByTestId('day-picker-overlay').click();
        // wait 2 seconds
        await this.page.waitForTimeout(2000);
        // Format the date into the expected label format
        const dateLabel = date;
        
        // Try to find the date in the current view
        let attempts = 0;
        while (!(await this.page.getByLabel(dateLabel).isVisible().catch(() => false)) && attempts < 6) {
            attempts++;
            // If date is not found, click next month and try again
            // Add a check to prevent infinite loops (e.g., max 12 attempts)
            const nextMonthButton = this.page.getByLabel('Next month');
            if (!(await nextMonthButton.isVisible().catch(() => false))) {
                throw new Error('Could not find the next month button');
            }
            // wait 1 second
            await this.page.waitForTimeout(1000);
            await nextMonthButton.click();
        }
        
        // Click the target date once found
        await this.page.getByLabel(dateLabel).click();
    }

    async selectTime(time: string) {
        await this.page.locator('[data-test="time-picker"]').selectOption(time);
    }

    async selectPartySize(size: string) {
        await this.page.locator('[data-test="party-size-picker"]').selectOption(size);
    }

    async searchAndSelectRestaurant(restaurantName: string) {
        await this.page.locator('[data-test="search-autocomplete-input"]').click();
        await this.page.locator('[data-test="search-autocomplete-input"]').fill(restaurantName);
        await this.page.locator('[data-test="freetext-autocomplete-item"]').click();
    }

    async selectTimeSlot(slotNumber: number = 3) {
        await this.page.locator('[data-test="pinned-restaurant-card"]')
            .getByTestId(`time-slot-${slotNumber}`)
            .getByLabel('Select table type for')
            .click();
        await this.page.locator('[data-test="seatingOption-default-button"]').click();
    }

    async agreeToTerms() {
        await this.page.locator('label')
            .filter({ hasText: 'I agree to the restaurant’s' })
            .getByRole('img')
            .click();
    }

    async completeReservation() {
        await this.page.locator('[data-test="complete-reservation-button"]').click();
    }




    // Convenience method to perform a complete reservation
    async makeReservation(options: {
        date: Date,
        time: string,
        partySize: string,
        restaurantName: string,
        timeSlot?: number
    }) {
        // await this.selectDate(options.date);
        await this.selectTime(options.time);
        await this.selectPartySize(options.partySize);
        await this.searchAndSelectRestaurant(options.restaurantName);
        await this.selectTimeSlot(options.timeSlot);
        await this.agreeToTerms();
        await this.completeReservation();
    }



}