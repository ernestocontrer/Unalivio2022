Feature: Rate and comission computing
  Ana as a user, wants to check the price easily, so that she figures out how much money to use

  Scenario: Rate conversion at portal
    Given that BitRefill is online,
    When Ana visits the site,
    Then she can check the conversion at the side.

  Scenario: Rate fetching
    Given that BitRefill is online,
    When the Bot visits the site,
    And 
    And 
    Then the Bot fetches the DASH/VES rate.

  Scenario: Rate conversion computing
    Given that the Bot fetched the MXN/DASH rate
    And that the Bot fetched the DASH/VES rate
    When the site requests the rate,
    Then the rate is the product of MXN/DASH rate with DASH/VES rate